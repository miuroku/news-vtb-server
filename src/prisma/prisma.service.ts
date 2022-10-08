import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';
import { databseURL } from './config';

@Injectable()
export class PrismaService 
  extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy {

    constructor() {
      super({
        datasources: {
          db: {
            url: databseURL
          }
        }
      });
    }

    async onModuleInit() {
      await this.$connect();
    }

    async onModuleDestroy() {
      await this.$disconnect();
    }
}
