import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export function ApiRefreshAuth() {
  return applyDecorators(
    ApiBearerAuth('refresh-token'),
    ApiOperation({ summary: 'Using refresh token' }),
  );
}
