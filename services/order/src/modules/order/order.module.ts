// src/modules/order/order.module.ts
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';

import { CorrelationIdMiddleware } from '@/core/middleware/correlation-id.middleware';
import { CatalogClient } from '@/infrastructure/http/catalog.client';

import { OrderController } from './api/controllers';
import { OrderService } from './application/services';
import { JwtStrategy } from './application/strategies';
import { OrderOutboxRelay } from './infrastructure/relays';
import {
  OrderRepository,
  OutboxRepository,
} from './infrastructure/repositories';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
    }),
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot({
      // <--- ПРИБРАЛИ RabbitMQModule звідси
      exchanges: [{ name: 'furniture-exchange', type: 'topic' }],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false }, // Щоб додаток не падав, якщо RabbitMQ ще не піднявся
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    JwtStrategy,
    CatalogClient,
    OrderOutboxRelay,
    { provide: 'IOrderRepository', useClass: OrderRepository },
    { provide: 'IOutboxRepository', useClass: OutboxRepository },
  ],
})
// app.module.ts або order.module.ts
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*'); // Застосувати до всіх маршрутів
  }
}
