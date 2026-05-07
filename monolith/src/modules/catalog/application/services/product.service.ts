import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProductRequest } from '@/modules/catalog/api/dto/requests';
import { ProductResponse } from '@/modules/catalog/api/dto/responses';
import { ProductMapper } from '@/modules/catalog/application/mappers';
import type { IProductRepository } from '@/modules/catalog/domain/contracts';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepo: IProductRepository,
  ) {}

  async create(dto: CreateProductRequest): Promise<ProductResponse> {
    const existing = await this.productRepo.findBySku(dto.sku);
    if (existing)
      throw new ConflictException('Product with this SKU already exists');

    const productDomain = ProductMapper.toDomain(dto);
    const savedProduct = await this.productRepo.save(productDomain);

    return ProductMapper.toResponse(savedProduct);
  }

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
