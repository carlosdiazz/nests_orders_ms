import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [OrdersModule, DatabaseModule],
})
export class AppModule {}
