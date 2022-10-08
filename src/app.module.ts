import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
