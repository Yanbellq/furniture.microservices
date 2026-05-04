import { Controller } from '@nestjs/common';
import { CatalogService } from '@/modules/catalog/application/services';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}
}
