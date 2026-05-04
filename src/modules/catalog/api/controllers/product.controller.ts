// src/modules/catalog/api/product.controller.ts
import { Controller, Get, Param } from '@nestjs/common';

import { ProductResponse } from '@/modules/catalog/api/dto/responses';
import { ProductService } from '@/modules/catalog/application/services';

@Controller('catalog')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ProductResponse[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponse> {
    return this.productService.getProductById(id);
  }
}
