import { Injectable } from '@nestjs/common';

import { MESSAGE, STATUS } from '@/common/constants';
import { PrismaService } from '@/infrastructure/prisma';

import { HealthResponse, HelloResponse } from './dto/responses';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): HelloResponse {
    return {
      status: STATUS.OK,
      message: MESSAGE.GREATINGS,
    };
  }

  getHealth(): HealthResponse {
    return {
      status: STATUS.OK,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  async getHealthDb() {
    try {
      await this.prisma.$queryRaw`SELECT 1`; // Перевірка конекшну до БД
      return {
        status: STATUS.OK,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (e) {
      return { status: STATUS.ERROR, database: 'disconnected', error: e };
    }
  }
}
