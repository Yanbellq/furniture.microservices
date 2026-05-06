import { UserResponse } from '@/modules/identity/api/dto/responses';
import { User } from '@/modules/identity/domain/entities';

export class UserMapper {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      companyId: user.companyId,
    };
  }
}
