import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CircuitBreaker from 'opossum';
import { catchError, lastValueFrom, retry, throwError, timeout } from 'rxjs';

import { ROUTES } from '@/common/constants';

@Injectable()
export class CatalogClient {
  private readonly logger = new Logger(CatalogClient.name);
  private breaker: CircuitBreaker;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Налаштування Circuit Breaker (Лаба 3)
    this.breaker = new CircuitBreaker(this.callApi.bind(this), {
      timeout: 3000, // Якщо Catalog не відповідає 3с — це помилка
      errorThresholdPercentage: 50, // Якщо 50% запитів лягло — розриваємо ланцюг
      resetTimeout: 10000, // Через 10с спробувати знову
    });

    this.breaker.fallback(() => {
      this.logger.warn('Circuit Breaker OPEN: Catalog service is failing');
      throw new InternalServerErrorException(
        'Catalog service is currently unavailable (Circuit Breaker)',
      );
    });
  }

  // Обгортка для Circuit Breaker
  private async callApi({ productId, correlationId }) {
    const url = `${ROUTES.CATALOG_SERVICE}catalog/product/${productId}`;

    const source$ = this.httpService
      .get(url, {
        headers: {
          'x-correlation-id': correlationId,
          'x-internal-key': this.configService.getOrThrow<string>(
            'INTERNAL_SECRET_KEY',
          ), // Додаємо міжсервісний секрет для аутентифікації
        },
      })
      .pipe(
        timeout(2000), // Паттерн: Таймаут (Лаба 3)
        retry(2), // Паттерн: Повторні спроби (Лаба 3)
        catchError(err => throwError(() => err)),
      );

    return lastValueFrom(source$);
  }

  async getProduct(productId: string, correlationId: string) {
    return this.breaker.fire({ productId, correlationId });
  }
}
