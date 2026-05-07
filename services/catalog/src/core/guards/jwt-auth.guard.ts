import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 1. Перевіряємо наявність внутрішнього секрету (міжсервісний запит)
    const internalSecret = request.headers['x-internal-key'];
    if (
      internalSecret ===
      this.configService.getOrThrow<string>('INTERNAL_SECRET_KEY')
    ) {
      return { isInternal: true }; // Пускаємо запит
    }

    // 2. Якщо секрету немає, перевіряємо JWT (запит від клієнта)
    if (err || !user) {
      throw err || new UnauthorizedException('Неавторизований доступ');
    }
    return user;
  }
}
