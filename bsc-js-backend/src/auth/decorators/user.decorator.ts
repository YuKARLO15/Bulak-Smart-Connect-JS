import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
  user: Record<string, unknown>;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
