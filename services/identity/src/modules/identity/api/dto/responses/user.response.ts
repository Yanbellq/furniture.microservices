import { IsId, IsMail, IsName, IsRole } from '@/common/validators';

export class UserResponse {
  @IsId()
  id!: string;

  @IsMail()
  email!: string;

  @IsName({ title: 'Full Name' })
  fullName!: string;

  @IsRole()
  role!: string;
}
