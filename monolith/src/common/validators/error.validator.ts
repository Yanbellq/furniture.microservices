import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const ApiValidationError = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid request body (Validation Error)',
      schema: {
        example: {
          statusCode: 400,
          timestamp: '2026-05-04T14:30:00.000Z',
          path: '/api/v1/catalog/123',
          error: {
            message: ['sku must be a string'],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
  );

export const ApiNotFoundError = () =>
  applyDecorators(
    ApiNotFoundResponse({
      description: 'Resource not found',
      schema: {
        example: {
          statusCode: 404,
          timestamp: '2026-05-04T14:30:00.000Z',
          path: '/api/v1/catalog/123',
          error: {
            message: 'Product with id 123 not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
  );

export const ApiConflictError = () =>
  applyDecorators(
    ApiConflictResponse({
      description: 'Resource already exists',
      schema: {
        example: {
          statusCode: 409,
          timestamp: '2026-05-04T14:30:00.000Z',
          path: '/api/v1/catalog/123',
          error: {
            message: 'Product with this SKU already exists',
            error: 'Conflict',
            statusCode: 409,
          },
        },
      },
    }),
  );

export const ApiDiedError = () =>
  applyDecorators(
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        example: {
          statusCode: 500,
          timestamp: '2026-05-04T14:30:00.000Z',
          path: '/api/v1/catalog/123',
          error: {
            message: 'Something went wrong on the server',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
    }),
  );

export const ApiAllStandardErrors = () =>
  applyDecorators(
    ApiValidationError(),
    ApiNotFoundError(),
    ApiConflictError(),
    ApiDiedError(),
  );
