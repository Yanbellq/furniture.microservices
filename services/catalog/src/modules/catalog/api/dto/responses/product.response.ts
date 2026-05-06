import {
  IsBool,
  IsId,
  IsSku,
  IsTitle,
  IsWholesalePrice,
} from '@/common/validators';

export class ProductResponse {
  @IsId()
  id!: string;

  @IsSku()
  sku!: string;

  @IsTitle()
  title!: string; // Mapping work example

  @IsWholesalePrice()
  wholesalePrice!: number; // Mapping work example

  @IsBool()
  isAvailable!: boolean;
}
