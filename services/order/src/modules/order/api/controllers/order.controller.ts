import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/core/guards';

import { OrderService } from '../../application/services';
import { CreateOrderRequest } from '../dto/requests';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Version('1')
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Створити нове замовлення (Lab 3 & 4)' })
  @ApiHeader({
    name: 'x-correlation-id',
    description:
      'Correlation ID для трасування (якщо не передано, згенерує Middleware)',
    required: false,
  })
  async create(
    @Body() dto: CreateOrderRequest,
    // @Headers('x-correlation-id') correlationId: string,
    @Req() req: any, // На випадок, якщо дістаємо userId з токена
  ) {
    console.log(req.user);
    // Якщо userId немає в DTO, беремо його з розшифрованого JWT (req.user.sub)
    const userId = req.user.id;
    console.log(userId);

    const correlationId = req['correlationId'];
    // Передаємо correlationId, який прийшов від клієнта або згенерований Middleware
    return this.orderService.create(
      { userId, items: dto.items },
      correlationId,
    );
  }
}
