import { ProductResponse } from '@/modules/catalog/api/dto/responses';
import { Product } from '@/modules/catalog/domain/entities';

export class ProductMapper {
  static toResponse(entity: Product): ProductResponse {
    return {
      id: entity.id,
      sku: entity.sku,
      title: entity.name,
      wholesalePrice: entity.price,
      isAvailable: entity.stock > 0,
    };
  }
}
