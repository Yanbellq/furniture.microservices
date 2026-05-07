// Для CronExpression
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

// Для AmqpConnection
import type { IOutboxRepository } from '../../domain/contracts';

@Injectable()
export class OrderOutboxRelay {
  private readonly logger = new Logger(OrderOutboxRelay.name);

  constructor(
    @Inject('IOutboxRepository') private readonly outboxRepo: IOutboxRepository,
    private readonly amqp: AmqpConnection,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async process() {
    const events = await this.outboxRepo.findUnprocessed(10);

    console.log(events);
    // console.log(events.payload);

    for (const event of events) {
      try {
        await this.amqp.publish(
          'furniture-exchange',
          'order.created',
          event.payload,
        );
        await this.outboxRepo.markAsProcessed(event.id!);
        this.logger.log(`[Relay] Подія ${event.type} відправлена успішно`);
      } catch (err) {
        this.logger.error(
          `[Relay] Помилка відправки в RabbitMQ: ${err instanceof Error ? err.message : 'Unknown error'}`,
        );
      }
    }
  }
}
