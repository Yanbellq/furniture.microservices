import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController, UserController } from './api/controllers';
import {
  AuthService,
  CryptoService,
  UserService,
} from './application/services';
import { UserRepository } from './infrastructure';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    CryptoService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class IdentityModule {}
