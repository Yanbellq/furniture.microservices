import { Module } from '@nestjs/common';

import { CatalogController, ProductController } from './api/controllers';
import { CatalogService, ProductService } from './application/services';
import { ProductRepository } from './infrastructure';

@Module({
  controllers: [CatalogController, ProductController],
  providers: [
    CatalogService,
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService],
})
export class CatalogModule {}
