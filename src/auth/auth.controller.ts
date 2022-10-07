import { Controller, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  async login(@Req() req: Request) {
    return this.authService.login()
  }
}
