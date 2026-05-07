import {
  IsDescription,
  IsName,
  IsPrice,
  IsSku,
  IsStock,
} from '@/common/validators';

export class CreateProductRequest {
  @IsSku()
  sku!: string;

  @IsName()
  name!: string; // Mapping work example

  @IsPrice()
  price!: number;

  @IsStock()
  stock!: number;

  @IsDescription()
  description?: string;
}
