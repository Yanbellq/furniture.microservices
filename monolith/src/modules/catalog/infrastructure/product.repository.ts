import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma';
import { IProductRepository } from '@/modules/catalog/domain/contracts';
import { Product } from '@/modules/catalog/domain/entities';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const items = await this.prisma.product.findMany();
    return items.map(
      item =>
        new Product(
          item.id,
          item.sku,
          item.name,
          Number(item.price),
          item.stock,
          item.description ?? undefined,
        ),
    );
  }

  async findById(id: string): Promise<Product | null> {
    const item = await this.prisma.product.findUnique({ where: { id } });
    if (!item) return null;
    return new Product(
      item.id,
      item.sku,
      item.name,
      Number(item.price),
      item.stock,
      item.description ?? undefined,
    );
  }

  async findBySku(sku: string): Promise<Product | null> {
    const item = await this.prisma.product.findUnique({ where: { sku } });
    if (!item) return null;
    return new Product(
      item.id,
      item.sku,
      item.name,
      Number(item.price),
      item.stock,
      item.description ?? undefined,
    );
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.prisma.product.upsert({
      where: { id: product.id || '' },
      update: {
        name: product.name,
        price: product.price,
        stock: product.stock,
      },
      create: {
        sku: product.sku,
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
      },
    });
    return new Product(
      saved.id,
      saved.sku,
      saved.name,
      Number(saved.price),
      saved.stock,
      saved.description ?? undefined,
    );
  }
}
