import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  // @Get('/:id')
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const userFromReq = req.user as IMyReqUser

    const user = await this.usersService.findOne(userFromReq.username);
    const sphere = await this.usersService.getSphereById(user.sphereId);

    return {
      username: user.username,
      email: user.email,
      img: user.profileImg,
      sphere_title: sphere.title
    };
  }
}

export interface IMyReqUser extends Express.User {
  username: string,
  sub: number
}
