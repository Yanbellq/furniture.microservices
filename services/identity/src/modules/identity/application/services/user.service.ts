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

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepo.findAll();
    return users.map(user => UserMapper.toResponse(user));
  }

  async getUserProfile(id: string): Promise<UserResponse> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toResponse(user);
  }
}
