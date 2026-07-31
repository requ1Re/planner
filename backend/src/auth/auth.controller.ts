import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '../decorators/public';
import { User } from '../generated/prisma/client';
import { AuthService } from './auth.service';
import { OidcAuthGuard } from './oidc-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('login')
  @UseGuards(OidcAuthGuard)
  login() {
    
  }

  @Public()
  @Get('callback')
  @UseGuards(OidcAuthGuard)
  callback(@Req() req: Request, @Res() res: Response) {
    
    const { access_token } = this.authService.login(req.user as User);

    return res.json({
      access_token
    });
  }
}
