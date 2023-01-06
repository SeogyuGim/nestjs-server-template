import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';

import * as crypto from 'crypto';

export const ApiController = (name: string) =>
  applyDecorators(Controller(name.toLowerCase()), ApiTags(name.toUpperCase()));

export const AdminController = (name: string) => {
  applyDecorators(
    Controller(name.toLowerCase()),
    ApiHeader({
      name: 'admin-id',
      required: true,
      allowEmptyValue: false,
      example: 'example.email@google.com',
      schema: {
        default: 'example.email@google.com',
      },
    }),
    ApiHeader({
      name: 'request-id',
      description:
        'Definition of the requestId header A unique request ID, represented by a UUID.',
      required: true,
      allowEmptyValue: true,
      example: crypto.randomUUID(),
      schema: {
        default: crypto.randomUUID(),
      },
    }),
    ApiHeader({
      name: 'X-Coinone-Id',
      description: 'Authorized Account_id from PLUS-API-GATEWAY',
      required: false,
      allowEmptyValue: true,
      example: 29618,
    }),
  );
};

export const BasicAuthGuard = () =>
  applyDecorators(UseGuards(AuthGuard('basic')), ApiBasicAuth());

export const JwtAuthGuard = () =>
  applyDecorators(UseGuards(AuthGuard('jwt')), ApiBearerAuth());
