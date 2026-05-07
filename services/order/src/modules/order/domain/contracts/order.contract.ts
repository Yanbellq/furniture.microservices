import { Order, Outbox } from '@/modules/order/domain/entities';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  createWithOutbox(order: Order, outbox: Outbox): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}
