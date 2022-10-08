import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { refreshTokenOptions, refreshTokenVerifyOptions } from './config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string)  {
    const user = await this.usersService.findOne(username);
    if (user && user.password == pass) {
      const {password, ...result} = user;
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

  async register(username: string, password: string) {
    // Add if user with such username already exists later
    const newUser = await this.usersService.createOne(username, password);
    const payload = {username: newUser.username, sub: newUser.userId};
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
