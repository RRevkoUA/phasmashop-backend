import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function ApiAccessAuth() {
  return applyDecorators(ApiBearerAuth('access-token'));
}
