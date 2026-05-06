import { Product } from '../entities';

export interface IProductRepository {
  findBySku(sku: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
}
