import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { refreshTokenOptions, refreshTokenVerifyOptions } from './config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async validateUser(username: string, pass: string)  {
    const user = await this.usersService.findOne(username);
    if (user && user.hashedPass == pass) {
      const {hashedPass, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {username: user.username, sub: user.userId};
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, refreshTokenOptions)
    }
  }

  async register(username: string, password: string, sphere: string) {
    // Add if user with such username already exists later
    const hashedPassword = await this.hashData(password);

    const possibleUser = await this.usersService.findOne(username);
    if (possibleUser) throw new ForbiddenException('This username already taken, please choose another one');

    const newUser = await this.usersService.createOne(username, hashedPassword, sphere);

    const payload = {username: newUser.username, sub: newUser.id};
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, refreshTokenOptions)
    }
  }

  async updateTokensUsignRefreshToken(refreshToken: string, getRefreshAlso: boolean = false) {
    if (!refreshToken) throw new ForbiddenException(`Couldn't find your refesh_token`);
    // Add checking if such user still exists.
    const payload_full = await this.jwtService.verify(refreshToken, refreshTokenVerifyOptions);
    const payload = {username: payload_full.username, sub: payload_full.sub};

    const ourAccessToken = this.jwtService.sign(payload);
    const ourRefreshToken = this.jwtService.sign(payload, refreshTokenOptions);

    if (getRefreshAlso) {
      return {
        access_token: ourAccessToken,
        refreshToken: ourRefreshToken
      }
    } else {
      return {
        access_token: ourAccessToken
      }
    }
  }
}
