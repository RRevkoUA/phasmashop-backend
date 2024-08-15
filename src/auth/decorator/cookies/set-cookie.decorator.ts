import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SetCookie = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();

    const setCookie = (name: string, value: string, options?: any) => {
      if (!options) {
        options = { httpOnly: true, secure: true };
      }
      response.cookie(name, value, options);
    };

    return setCookie;
  },
);
