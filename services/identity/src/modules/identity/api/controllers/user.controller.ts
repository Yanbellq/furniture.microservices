// src/modules/identity/api/user.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserResponse } from '@/modules/identity/api/dto/responses';
import { UserService } from '@/modules/identity/application/services';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllProfiles(): Promise<UserResponse[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getProfile(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUserProfile(id);
  }
}
