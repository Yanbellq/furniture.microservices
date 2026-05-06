export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password?: string, // Опційно, щоб не тягати всюди
    public firstName?: string,
    public lastName?: string,
    public companyId?: string,
  ) {}
}
