import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleEnum } from '../enums';
import { JwtGuard, RoleGuard } from '../guard';
import { ApiAccessAuth } from './api-access.decorator';

export const Role = (role: RoleEnum) => {
  return applyDecorators(
    ApiAccessAuth(),
    SetMetadata('role', role),
    UseGuards(JwtGuard, RoleGuard),
  );
};
