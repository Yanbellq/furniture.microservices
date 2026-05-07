export class Outbox {
  constructor(
    public readonly type: string, // Наприклад, 'ORDER_CREATED'
    public readonly payload: Record<string, any>, // Дані події
    public readonly id?: string,
    public readonly processed: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}
}
