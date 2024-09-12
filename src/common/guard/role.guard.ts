import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasHigherOrEqualRole, RoleEnum } from '../enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<RoleEnum>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && hasHigherOrEqualRole(user.role, role)
      ? true
      : (() => {
          throw new UnauthorizedException(
            'You do not have permission to access this resource',
          );
        })();
  }
}
