import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto) // КРИТИЧНО для вкладених об'єктів
  items!: OrderItemDto[];
}
