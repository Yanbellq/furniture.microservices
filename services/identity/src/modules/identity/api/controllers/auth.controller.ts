import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  LoginRequest,
  RegisterRequest,
} from '@/modules/identity/api/dto/requests';
import { AuthService } from '@/modules/identity/application/services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  async register(@Body() dto: RegisterRequest) {
    return this.authService.register(dto);
  }

  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизація' })
  async login(@Body() dto: LoginRequest) {
    return this.authService.login(dto);
  }
}
