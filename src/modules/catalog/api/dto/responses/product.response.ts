export class ProductResponse {
  id!: string;
  sku!: string;
  title!: string; // В API називаємо title замість name для прикладу мапінгу
  wholesalePrice!: number;
  isAvailable!: boolean;
}
