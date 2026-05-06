// src/modules/identity/identity.module.ts
import { Module } from '@nestjs/common';

import { UserController } from './api/controllers';
import { UserService } from './application/services';
import { UserRepository } from './infrastructure';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserService], // Експортуємо для OrderModule
})
export class IdentityModule {}
