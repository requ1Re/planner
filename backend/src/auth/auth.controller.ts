import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('login/:provider')
  login() {
    passport;
  }
}
