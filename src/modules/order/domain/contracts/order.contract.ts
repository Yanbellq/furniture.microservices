import { Order } from '@/modules/order/domain/entities';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}
