import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiConflictError,
  ApiDiedError,
  ApiNotFoundError,
  ApiValidationError,
} from '@/common/validators';
import { CreateProductRequest } from '@/modules/catalog/api/dto/requests';
import { ProductResponse } from '@/modules/catalog/api/dto/responses';
import { ProductService } from '@/modules/catalog/application/services';

@ApiTags('Product')
@Controller('product')
@ApiDiedError()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Version('1')
  @ApiOperation({ summary: 'Get all products endpoint' })
  @ApiOkResponse({ type: ProductResponse, isArray: true })
  @Get()
  async findAll(): Promise<ProductResponse[]> {
    return this.productService.getAllProducts();
  }

  @Version('1')
  @ApiOperation({ summary: 'Create a new product endpoint' })
  @ApiCreatedResponse({ type: ProductResponse })
  @ApiValidationError()
  @ApiConflictError()
  @Post()
  async create(@Body() dto: CreateProductRequest): Promise<ProductResponse> {
    return this.productService.create(dto);
  }

  @Version('1')
  @ApiOperation({ summary: 'Get a product by ID endpoint' })
  @ApiOkResponse({ type: ProductResponse })
  @ApiNotFoundError()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponse> {
    return this.productService.getProductById(id);
  }
}
