export class Order {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public status: string,
    public totalAmount: number,
    public items: OrderItem[],
    public readonly createdAt: Date,
  ) {}
}

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly priceAtPurchase: number,
  ) {}
}
