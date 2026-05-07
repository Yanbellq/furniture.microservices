export class User {
  constructor(
    public readonly id: string | undefined,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public role: string,
  ) {}
}
