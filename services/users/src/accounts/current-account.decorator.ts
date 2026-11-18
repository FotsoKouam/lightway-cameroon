import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAccount = createParamDecorator((_data, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});
