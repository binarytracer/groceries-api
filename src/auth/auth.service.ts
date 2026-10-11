import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Static credentials for now. Replace with a user store later.
const STATIC_USER = {
  id: 'user-1',
  username: 'admin',
  password: 'password123',
};

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

export type TokenType = 'access' | 'refresh';

export interface TokenPayload {
  sub: string;
  username: string;
  type: TokenType;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private get secret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  async login(username: string, password: string): Promise<AuthTokens> {
    if (
      username !== STATIC_USER.username ||
      password !== STATIC_USER.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(STATIC_USER.id, STATIC_USER.username);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.verify(refreshToken, 'refresh');
    return this.issueTokens(payload.sub, payload.username);
  }

  async verify(token: string, type: TokenType): Promise<TokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token, {
        secret: this.secret,
      });
      if (payload.type !== type) throw new Error('wrong token type');
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async issueTokens(
    sub: string,
    username: string,
  ): Promise<AuthTokens> {
    const sign = (type: TokenType, expiresIn: number) =>
      this.jwt.signAsync(
        { sub, username, type },
        { secret: this.secret, expiresIn },
      );

    return {
      accessToken: await sign('access', ACCESS_TTL_SECONDS),
      refreshToken: await sign('refresh', REFRESH_TTL_SECONDS),
      expiresIn: ACCESS_TTL_SECONDS,
    };
  }
}
