import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PrismaService');
  async onModuleInit() {
    await this.$connect();
    this.logger.debug('Databse Connect');
  }
}
