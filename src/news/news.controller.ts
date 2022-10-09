import { Controller, Get, InternalServerErrorException, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('/trends')
  @UseGuards(JwtAuthGuard)
  async getTrends(@Req() req: Request) {
    const user = req.user as IMyReqUser;
    return await this.newsService.getTrends(user);
  }

  @Get('/insights')
  @UseGuards(JwtAuthGuard)
  async getInsights(@Req() req: Request) {
    const user = req.user as IMyReqUser;
    return await this.newsService.getInsights(user);
  }

  @Get('/digest?')
  @UseGuards(JwtAuthGuard)
  async getDigest(@Query('userId') userId: number, @Req() req: Request) {
    //console.log(`Our req : ${JSON.stringify(req.user, null, 4)}`);
    const user = req.user as IMyReqUser;
    let result = null;

    result = await this.newsService.getDigest(user);

    if (!result) throw new InternalServerErrorException('lol');

    return result;
  }
}

export interface IMyReqUser extends Express.User {
  username: string,
  sub: number
}

export interface IReqWithUser extends Request {
  user: any;
}