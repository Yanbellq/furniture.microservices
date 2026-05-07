import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@/common/types';
import {
  LoginRequest,
  RegisterRequest,
} from '@/modules/identity/api/dto/requests';
import { UserMapper } from '@/modules/identity/application/mappers';
import type { IUserRepository } from '@/modules/identity/domain/contracts';

import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterRequest) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('User already exists');

    const hashedPass = await this.cryptoService.hashPassword(dto.password);
    const user = UserMapper.toDomain(dto, hashedPass);
    const savedUser = await this.userRepo.save(user);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };
    return {
      access_token: this.generateToken(payload, 1),
      refresh_token: this.generateToken(payload, 24),
      user: UserMapper.toResponse(savedUser),
    };
  }

  async login(dto: LoginRequest) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await this.cryptoService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.generateToken(payload, 1),
      refresh_token: this.generateToken(payload, 24),
      user: UserMapper.toResponse(user),
    };
  }

  private generateToken(payload: JwtPayload, time: number): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: `${time}h`,
    });
  }
}
