import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const tokens = this.authService.updateAccessToken(refreshToken);

    return tokens;
  }
}
