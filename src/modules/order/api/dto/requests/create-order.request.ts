export class CreateOrderRequest {
  userId!: string;
  items!: {
    productId: string;
    quantity: number;
  }[];
}
