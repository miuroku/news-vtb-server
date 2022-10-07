import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
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
  async register(@Req() req: Request) {
    return this.authService.register(req.body.username, req.body.password);
  }
}
