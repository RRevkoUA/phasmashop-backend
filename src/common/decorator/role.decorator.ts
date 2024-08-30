import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleEnum } from '../enums';
import { JwtGuard, RoleGuard } from '../guard';

export const Role = (role: RoleEnum) => {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(JwtGuard, RoleGuard),
  );
};
