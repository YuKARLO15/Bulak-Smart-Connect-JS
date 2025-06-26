import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Define interface for request with user
interface RequestWithUser extends Request {
  user?: {
    roles?: Array<{ name: string }> | string[];
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRoles = request.user?.roles || [];

    // Handle both string array and object array formats
    const roleNames = userRoles.map((role: string | { name: string }) =>
      typeof role === 'string' ? role : (role as { name: string }).name,
    );

    return requiredRoles.some((role) => roleNames.includes(role));
  }
}
