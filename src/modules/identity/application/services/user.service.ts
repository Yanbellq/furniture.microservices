import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UserResponse } from '@/modules/identity/api/dto/responses';
import { UserMapper } from '@/modules/identity/application/mappers';
import type { IUserRepository } from '@/modules/identity/domain/contracts';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async getUserProfile(id: string): Promise<UserResponse> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    // Мапимо сутність в DTO (безпечно повертаємо дані без пароля)
    return UserMapper.toResponse(user);
  }
}
