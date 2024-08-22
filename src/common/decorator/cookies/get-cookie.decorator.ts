import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCookie = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
