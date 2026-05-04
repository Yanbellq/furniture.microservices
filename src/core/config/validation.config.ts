import { ValidationPipeOptions } from '@nestjs/common';

export function getValidationConfig(): ValidationPipeOptions {
  return {
    transform: true, // Автоматично перетворює типи (напр. string -> number)
    whitelist: true, // Видаляє поля, яких немає в DTO
    forbidNonWhitelisted: true, // Викидає помилку, якщо є зайві поля
  };
}
