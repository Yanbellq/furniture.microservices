import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma';
import { IUserRepository } from '@/modules/identity/domain/contracts';
import { User } from '@/modules/identity/domain/entities';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName!,
      data.lastName!,
      data.companyId!,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName!,
      data.lastName!,
      data.companyId!,
    );
  }

  async save(user: User): Promise<User> {
    const data = await this.prisma.user.upsert({
      where: { id: user.id || '' },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      create: {
        email: user.email,
        password: user.password!, // У реальному проекті тут має бути хеш
        firstName: user.firstName,
        lastName: user.lastName,
        companyId: user.companyId,
      },
    });
    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName!,
      data.lastName!,
      data.companyId!,
    );
  }
}
