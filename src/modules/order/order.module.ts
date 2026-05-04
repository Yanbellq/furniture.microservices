// src/modules/order/order.module.ts
import { Module } from '@nestjs/common';

import { CatalogModule } from '../catalog/catalog.module';

import { OrderController } from './api/controllers';
import { OrderService } from './application/services';
import { OrderRepository } from './infrastructure';

@Module({
  imports: [
    CatalogModule, // Тепер ми можемо інжектувати ProductService
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
})
export class OrderModule {}
