import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

import { IOutboxRepository } from '../../domain/contracts';
import { Outbox } from '../../domain/entities/outbox.entity';

@Injectable()
export class OutboxRepository implements IOutboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnprocessed(limit: number): Promise<Outbox[]> {
    const records = await this.prisma.outbox.findMany({
      where: { processed: false },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    return records.map(
      r =>
        new Outbox(
          r.type,
          r.payload as Record<string, any>,
          r.id,
          r.processed,
          r.createdAt,
        ),
    );
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.prisma.outbox.update({
      where: { id },
      data: { processed: true },
    });
  }
}
