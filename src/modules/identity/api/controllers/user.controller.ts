// src/modules/identity/api/user.controller.ts
import { Controller, Get, Param } from '@nestjs/common';

import { UserResponse } from '@/modules/identity/api/dto/responses';
import { UserService } from '@/modules/identity/application/services';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUserProfile(id);
  }
}
