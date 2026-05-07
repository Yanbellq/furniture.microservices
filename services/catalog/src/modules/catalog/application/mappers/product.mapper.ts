import { CreateProductRequest } from '@/modules/catalog/api/dto/requests';
import { ProductResponse } from '@/modules/catalog/api/dto/responses';
import { Product } from '@/modules/catalog/domain/entities';

export class ProductMapper {
  static toDomain(dto: CreateProductRequest): Product {
    return new Product(
      undefined, // ID ще немає
      dto.sku,
      dto.name,
      dto.price,
      dto.stock,
      dto.description,
    );
  }

  static toResponse(entity: Product): ProductResponse {
    return {
      id: entity.id!,
      sku: entity.sku,
      title: entity.name,
      wholesalePrice: Number(entity.price),
      isAvailable: entity.stock > 0,
    };
  }
}
