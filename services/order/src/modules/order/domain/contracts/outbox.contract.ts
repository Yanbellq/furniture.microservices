import { Outbox } from '../entities';

export interface IOutboxRepository {
  /**
   * Знайти всі необроблені події для відправки
   */
  findUnprocessed(limit: number): Promise<Outbox[]>;

  /**
   * Позначити подію як відправлену
   */
  markAsProcessed(id: string): Promise<void>;
}
