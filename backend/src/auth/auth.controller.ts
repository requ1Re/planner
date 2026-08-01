import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '../decorators/public';
import { User } from '../generated/prisma/client';
import { AuthService } from './auth.service';
import { BasicUser } from './jwt.strategy';
import { OidcAuthGuard } from './oidc-auth.guard';

const MOBILE_APP_CALLBACK_URL = 'plannerswift://callback';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('login')
  @UseGuards(OidcAuthGuard)
  login() {}

  @Public()
  @Get('callback')
  @UseGuards(OidcAuthGuard)
  callback(@Req() req: Request, @Res() res: Response) {
    const { access_token } = this.authService.login(req.user as User);

    const isMobile = req.session.mobileCallback === true;
    delete req.session.mobileCallback;

    if (isMobile) {
      const redirectUrl = new URL(MOBILE_APP_CALLBACK_URL);
      redirectUrl.searchParams.set('token', access_token);
      return res.redirect(redirectUrl.toString());
    }

    return res.json({
      access_token,
    });
  }

  @Get('profile')
  profile(@Req() req: Request) {
    const basicUser = req.user as BasicUser;
    const user = this.authService.getUser(basicUser.userId);

    return user;
  }
}
