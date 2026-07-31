import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-openidconnect';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oidc') {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      issuer: configService.getOrThrow<string>('AUTH_ISSUER'),
      authorizationURL: configService.getOrThrow<string>('AUTH_AUTHORIZE_URL'),
      tokenURL: configService.getOrThrow<string>('AUTH_TOKEN_URL'),
      userInfoURL: configService.getOrThrow<string>('AUTH_USERINFO_URL'),
      clientID: configService.getOrThrow<string>('AUTH_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('AUTH_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('AUTH_REDIRECT_URL'),
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(issuer: string, profile: Profile) {
    const sub = profile.id;

    const user = await this.authService.validateAndLinkOidcUser(
      issuer,
      sub,
      profile,
    );

    if (!user) {
      throw new UnauthorizedException('User could not be validated or created');
    }

    // Whatever you return here is injected into the Request object (req.user)
    return user;
  }
}
