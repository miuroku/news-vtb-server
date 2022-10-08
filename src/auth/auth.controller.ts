import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { LocalAuthGuard } from './strategies/local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto.username, authDto.password, authDto.sphere);
  }

  @Post('update-tokens?')
  async updateTokens(
    @Req() req: IGetRefreshTokenRequest,
    @Query('get-refresh-also') getRefreshAlso: boolean
  ) {
    return this.authService.updateTokensUsignRefreshToken(req.body.refresh_token, getRefreshAlso);
  }
}

export interface IGetRefreshTokenRequest extends Request {
  refresh_token: string
}