import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export const IsId = () =>
  applyDecorators(
    ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Unique identifier for the item',
    }),
    IsString({ message: 'Id must be a string' }),
  );

export const IsBool = () =>
  applyDecorators(
    ApiProperty({
      example: true,
      description: 'Boolean value',
    }),
    IsBoolean({ message: 'Value must be a boolean' }),
  );

export const IsSku = () =>
  applyDecorators(
    ApiProperty({
      example: 'HINGE-001',
      description: 'Unique identifier for the item',
    }),
    IsString({ message: 'Sku must be a string' }),
    MinLength(3, { message: 'Sku must be at least 3 characters long' }),
  );

export const IsPrice = () =>
  applyDecorators(
    ApiProperty({
      example: 45.5,
      description: 'Price of the one item',
    }),
    IsNumber(
      { allowNaN: false, allowInfinity: false },
      { message: 'Price must be a valid number' },
    ),
    IsPositive({ message: 'Price must be a positive number' }),
  );

export const IsWholesalePrice = () =>
  applyDecorators(
    ApiProperty({
      example: 25.5,
      description: 'Wholesale price of the one item',
    }),
    IsNumber(
      { allowNaN: false, allowInfinity: false },
      { message: 'Wholesale price must be a valid number' },
    ),
    IsPositive({ message: 'Wholesale price must be a positive number' }),
  );

export const IsName = () =>
  applyDecorators(
    ApiProperty({
      example: 'Furniture Hinge 110°',
      description: 'Product name',
    }),
    IsString({ message: 'Name must be a string' }),
    MinLength(3, { message: 'Name must be at least 3 characters long' }),
  );

export const IsTitle = () =>
  applyDecorators(
    ApiProperty({
      example: 'Hinge',
      description: 'Title of the item',
    }),
    IsString({ message: 'Title must be a string' }),
  );

export const IsStock = () =>
  applyDecorators(
    ApiProperty({ example: 100, description: 'Stock quantity' }),
    IsInt({ message: 'Stock must be an integer' }),
    Min(0, { message: 'Stock must be a non-negative number' }),
  );

export const IsDescription = () =>
  applyDecorators(
    ApiProperty({ example: 'Product description...', required: false }),
    IsString({ message: 'Description must be a string' }),
    IsOptional({ message: 'Description must be a string' }),
  );
