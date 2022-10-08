import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
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

  @Get('/digest?')
  @UseGuards(JwtAuthGuard)
  async getDigest(@Query('userId') userId: number, @Req() req: Request) {
    //console.log(`Our req : ${JSON.stringify(req.user, null, 4)}`);
    const user = req.user as IMyReqUser;

    return await this.newsService.getDigest(user);
  }
}

export interface IMyReqUser extends Express.User {
  username: string,
  sub: number
}

export interface IReqWithUser extends Request {
  user: any;
}