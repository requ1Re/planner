import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-openidconnect';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      issuer: process.env['AUTH_ISSUER'] ?? '',
      authorizationURL: process.env['AUTH_AUTHORIZE_URL'] ?? '',
      tokenURL: process.env['AUTH_TOKEN_URL'] ?? '',
      userInfoURL: process.env['AUTH_USERINFO_URL'] ?? '',
      clientID: process.env['AUTH_CLIENT_ID'] ?? '',
      clientSecret: process.env['AUTH_CLIENT_SECRET'] ?? '',
      callbackURL: location.host + '/auth/callback',
    });
  }

  async validate(issuer, profile, callback): Promise<any> {}
}
