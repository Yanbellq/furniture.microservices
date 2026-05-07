import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IOrderRepository } from '@/modules/order/domain/contracts';
import { Order, OrderItem, Outbox } from '@/modules/order/domain/entities';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<Order> {
    const saved = await this.prisma.order.create({
      data: {
        userId: order.userId,
        status: order.status as any,
        totalAmount: order.totalAmount,
        items: {
          create: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
      include: { items: true },
    });

    return new Order(
      saved.id,
      saved.userId,
      saved.status,
      Number(saved.totalAmount),
      saved.items.map(
        i => new OrderItem(i.productId, i.quantity, Number(i.priceAtPurchase)),
      ),
      saved.createdAt,
    );
  }

  async createWithOutbox(order: Order, outbox: Outbox): Promise<Order> {
    return await this.prisma.$transaction(async tx => {
      const saved = await tx.order.create({
        data: {
          userId: order.userId,
          status: order.status as any,
          totalAmount: order.totalAmount,
          items: {
            create: order.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
            })),
          },
        },
        include: { items: true },
      });

      const finalPayload = {
        ...outbox.payload,
        orderId: saved.id, // Тепер він точно є
      };

      await tx.outbox.create({
        data: { type: outbox.type, payload: finalPayload as any },
      });

      return new Order(
        saved.id,
        saved.userId,
        saved.status,
        Number(saved.totalAmount),
        saved.items.map(
          i =>
            new OrderItem(i.productId, i.quantity, Number(i.priceAtPurchase)),
        ),
        saved.createdAt,
      );
    });
  }

  async findById(id: string): Promise<Order | null> {
    const data = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!data) return null;
    return new Order(
      data.id,
      data.userId,
      data.status,
      Number(data.totalAmount),
      data.items.map(
        i => new OrderItem(i.productId, i.quantity, Number(i.priceAtPurchase)),
      ),
      data.createdAt,
    );
  }
}
