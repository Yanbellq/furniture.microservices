// src/modules/order/api/order.controller.ts
import { Body, Controller, Post } from '@nestjs/common';

import { CreateOrderRequest } from '@/modules/order/api/dto/requests';
import { OrderService } from '@/modules/order/application/services';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderRequest) {
    return this.orderService.createOrder(dto);
  }
}
