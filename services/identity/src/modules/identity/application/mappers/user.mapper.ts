import { RegisterRequest } from '@/modules/identity/api/dto/requests';
import { UserResponse } from '@/modules/identity/api/dto/responses';
import { User } from '@/modules/identity/domain/entities';

export class UserMapper {
  static toDomain(dto: RegisterRequest, hashedPass: string): User {
    return new User(
      undefined,
      dto.email,
      hashedPass,
      dto.firstName,
      dto.lastName,
      'CLIENT',
    );
  }

  static toResponse(user: User): UserResponse {
    return {
      id: user.id!,
      email: user.email,
      fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      role: user.role,
    };
  }
}
