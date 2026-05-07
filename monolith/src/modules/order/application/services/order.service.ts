import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ProductService } from '@/modules/catalog/application/services';
import { CreateOrderRequest } from '@/modules/order/api/dto/requests';
import type { IOrderRepository } from '@/modules/order/domain/contracts';
import { Order, OrderItem } from '@/modules/order/domain/entities';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepo: IOrderRepository,
    private readonly productService: ProductService, // Використовуємо сервіс каталогу
  ) {}

  async createOrder(dto: CreateOrderRequest) {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of dto.items) {
      // КРИТИЧНО: звертаємось до CatalogModule через його публічний API (Service)
      const product = await this.productService.getProductById(item.productId);

      if (!product.isAvailable) {
        throw new BadRequestException(
          `Product ${product.title} is out of stock`,
        );
      }

      totalAmount += product.wholesalePrice * item.quantity;
      orderItems.push(
        new OrderItem(product.id, item.quantity, product.wholesalePrice),
      );
    }

    const newOrder = new Order(
      undefined, // ID згенерує база
      dto.userId,
      'PENDING',
      totalAmount,
      orderItems,
      new Date(),
    );

    return this.orderRepo.create(newOrder);
  }
}
