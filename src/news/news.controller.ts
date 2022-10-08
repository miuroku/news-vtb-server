import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
// import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { IMyReqUser } from 'src/users/users.controller';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('/trends')
  @UseGuards(JwtAuthGuard)
  async getTrends(@Req() req: Request) {
    return await this.newsService.getTrends();
  }

  @Get('/insights')
  @UseGuards(JwtAuthGuard)
  async getInsights(@Req() req: Request) {
    return await this.newsService.getInsights();
  }

  @Get('/digest')
  @UseGuards(JwtAuthGuard)
  async getDigest(@Req() req: IReqWithUser) {
    const user = req.user;
    return await this.getDigest(user);
  }
}

export interface IReqWithUser extends Request {
  user: any;
}