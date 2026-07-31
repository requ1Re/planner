import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-openidconnect';
import { User } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BasicUser } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateAndLinkOidcUser(
    issuer: string,
    sub: string,
    profile: Profile,
  ): Promise<User> {
    const existingIdentity = await this.prisma.userIdentity.findUnique({
      where: {
        providerName_providerSub: {
          providerName: this.configService.getOrThrow<string>('AUTH_NAME'),
          providerSub: sub,
        },
      },
      include: { user: true },
    });

    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new BadRequestException('Missing email on oidc profile');
    }

    if (existingIdentity) {
      // update data
      const user = await this.prisma.user.update({
        where: {
          id: existingIdentity.userId,
        },
        data: {
          email,
          displayName: profile.displayName,
        },
      });
      return user;
    }

    try {
      const newUser = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email,
            displayName: profile.displayName,
          },
        });

        await tx.userIdentity.create({
          data: {
            providerName: this.configService.getOrThrow<string>('AUTH_NAME'),
            providerSub: sub,
            userId: user.id,
          },
        });

        return user;
      });
      return newUser;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  login(user: User) {
    const payload: BasicUser = {
      userId: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
