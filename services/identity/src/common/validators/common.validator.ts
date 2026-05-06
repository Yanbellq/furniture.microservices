import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

export const IsId = () =>
  applyDecorators(
    ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsString({ message: 'Id must be a string' }),
  );

export const IsBool = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: true,
    }),
    IsBoolean({ message: `${title} must be a boolean` }),
  );

export const IsMail = () =>
  applyDecorators(
    ApiProperty({
      example: 'user@example.com',
    }),
    IsEmail(),
  );

export const IsName = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: 'John',
    }),
    IsString({ message: `${title} must be a string` }),
    MinLength(2, { message: `${title} must be at least 2 characters long` }),
  );

export const IsPassword = () =>
  applyDecorators(
    ApiProperty({
      example: 'Password123',
    }),
    IsString({ message: 'Password must be a string' }),
    MinLength(8, { message: 'Password must be at least 8 characters long' }),
  );

export const IsRole = () => {
  const roles = Object.values(UserRole);
  return applyDecorators(
    ApiProperty({
      example: UserRole.CLIENT,
      description: `User role, can be ${roles.join(', ')}`,
      enum: UserRole,
    }),
    IsEnum(UserRole, { message: 'Role must be a valid user role' }),
  );
};
