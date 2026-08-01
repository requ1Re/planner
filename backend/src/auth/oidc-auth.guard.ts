import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

declare module 'express-session' {
  interface SessionData {
    mobileCallback?: boolean;
  }
}

@Injectable()
export class OidcAuthGuard extends AuthGuard('oidc') {
  getAuthenticateOptions(context: ExecutionContext) {
    return { session: false };
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    if (req.query.platform === 'ios') {
      req.session.mobileCallback = true;
    }

    return super.canActivate(context);
  }
}
