import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class InventoryConsumer {
  private readonly logger = new Logger(InventoryConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @RabbitSubscribe({
    exchange: 'furniture-exchange',
    routingKey: 'order.created',
    queue: 'inventory-update-queue', // Назва черги в RabbitMQ
  })
  async handleOrderCreated(payload: any) {
    console.log(payload);
    const { orderId, items, correlationId } = payload;

    this.logger.log(
      `[ID: ${correlationId}] 📥 Отримано подію замовлення ${orderId}. Починаю оновлення складу...`,
    );

    try {
      // Оновлюємо склад для кожного товару в транзакції
      await this.prisma.$transaction(
        items.map((item: any) =>
          this.prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      this.logger.log(
        `[ID: ${correlationId}] ✅ Склад успішно оновлено для замовлення ${orderId}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(
        `[ID: ${correlationId}] ❌ Помилка оновлення складу: ${errorMessage}`,
      );
      // Тут можна було б реалізувати логіку "компенсуючої транзакції" (Saga),
      // але для Лаби 4 цього рівня достатньо.
    }
  }
}
