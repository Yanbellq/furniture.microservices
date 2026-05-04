import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ProductResponse } from '@/modules/catalog/api/dto/responses';
import { ProductMapper } from '@/modules/catalog/application/mappers';
import type { IProductRepository } from '@/modules/catalog/domain/contracts';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepo: IProductRepository,
  ) {}

  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await this.productRepo.findAll();
    return products.map(product => ProductMapper.toResponse(product));
  }

  async getProductById(id: string): Promise<ProductResponse> {
    const product = await this.productRepo.findById(id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return ProductMapper.toResponse(product);
  }
}
