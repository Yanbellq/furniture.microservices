export class Product {
  constructor(
    public readonly id: string,
    public sku: string,
    public name: string,
    public price: number,
    public stock: number,
    public description: string | null,
  ) {}
}
