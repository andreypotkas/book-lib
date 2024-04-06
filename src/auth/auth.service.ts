import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthTokens, TokenPayload } from './interfaces/tokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validatePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const passwordEquals = await bcrypt.compare(oldPassword, newPassword);

    return !!passwordEquals;
  }

  verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    return payload;
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const userId = this.verifyRefreshToken(refreshToken);

      const tokens = this.generateTokens(userId);

      return tokens.accessToken;
    } catch (e) {
      return null;
    }
  }

  public generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    const tokens = { accessToken, refreshToken };

    return tokens;
  }
}
