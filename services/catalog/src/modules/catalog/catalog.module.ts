import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from '@/core/guards';

import { ProductController } from './api/controllers';
import { ProductService } from './application/services';
import { JwtStrategy } from './application/strategies';
import { InventoryConsumer } from './infrastructure/consumers';
import { ProductRepository } from './infrastructure/repositories';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [{ name: 'furniture-exchange', type: 'topic' }],
      uri: 'amqp://guest:guest@localhost:5672',
    }),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    JwtStrategy,
    InventoryConsumer,
    JwtAuthGuard,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
})
export class CatalogModule {}
