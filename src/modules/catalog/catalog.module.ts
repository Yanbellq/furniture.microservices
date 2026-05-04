import { Module } from '@nestjs/common';

import { ProductController } from './api/controllers';
import { ProductService } from './application/services';
import { ProductRepository } from './infrastructure';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService],
})
export class CatalogModule {}
