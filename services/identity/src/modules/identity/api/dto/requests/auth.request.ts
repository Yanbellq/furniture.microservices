import { IsMail, IsName, IsPassword } from '@/common/validators';

export class RegisterRequest {
  @IsMail()
  email!: string;

  @IsPassword()
  password!: string;

  @IsName({ title: 'First Name' })
  firstName!: string;

  @IsName({ title: 'Last Name' })
  lastName!: string;
}

export class LoginRequest {
  @IsMail()
  email!: string;

  @IsPassword()
  password!: string;
}
