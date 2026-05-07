import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { CatalogClient } from '@/infrastructure/http/catalog.client';
import type { IOrderRepository } from '@/modules/order/domain/contracts';

import { CreateOrderRequest } from '../../api/dto/requests';
import { Order, OrderItem, Outbox } from '../../domain/entities';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepo: IOrderRepository,
    private readonly catalogClient: CatalogClient, // Використовуємо сервіс каталогу
  ) {}

  // async createOrder(dto: CreateOrderRequest) {
  //   let totalAmount = 0;
  //   const orderItems: OrderItem[] = [];

  //   for (const item of dto.items) {
  //     // КРИТИЧНО: звертаємось до CatalogModule через його публічний API (Service)
  //     const product = await this.productService.getProductById(item.productId);

  //     if (!product.isAvailable) {
  //       throw new BadRequestException(
  //         `Product ${product.title} is out of stock`,
  //       );
  //     }

  //     totalAmount += product.wholesalePrice * item.quantity;
  //     orderItems.push(
  //       new OrderItem(product.id, item.quantity, product.wholesalePrice),
  //     );
  //   }

  //   const newOrder = new Order(
  //     undefined, // ID згенерує база
  //     dto.userId,
  //     'PENDING',
  //     totalAmount,
  //     orderItems,
  //     new Date(),
  //   );

  //   return this.orderRepo.create(newOrder);
  // }

  async create(
    dto: { userId: string; items: CreateOrderRequest['items'] },
    correlationId: string,
  ) {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    // 1. Отримуємо дані про всі товари (Lab 3)
    for (const item of dto.items) {
      // @ts-expect-error - метод getProduct повертає AxiosResponse, тому беремо .data
      const product = (
        await this.catalogClient.getProduct(item.productId, correlationId)
      ).data;

      if (!product.isAvailable || product.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name || product.title} is not available in requested quantity`,
        );
      }

      totalAmount += product.wholesalePrice * item.quantity;
      orderItems.push(
        new OrderItem(product.id, item.quantity, product.wholesalePrice),
      );
    }

    // 2. Створюємо сутність замовлення
    const order = new Order(
      undefined,
      dto.userId,
      'PENDING',
      totalAmount,
      orderItems,
      new Date(),
    );

    // 3. Готуємо Outbox (Lab 4)
    // Payload має містити масив товарів для Catalog Service, щоб він міг оновити сток
    const outboxPayload = {
      orderId: order.id,
      items: order.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      correlationId, // <--- ПЕРЕВІР, ЩО ВІН НЕ UNDEFINED ТУТ
    };

    console.log('DEBUG PAYLOAD BEFORE DB:', outboxPayload);

    const outbox = new Outbox('ORDER_CREATED', outboxPayload);

    // 4. Атомарне збереження в транзакції
    return this.orderRepo.createWithOutbox(order, outbox);
  }
}
