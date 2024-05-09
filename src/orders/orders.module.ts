import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

//Propio
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsService } from './products.service';
import { envs, PRODUCT_SERVICE } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.PRODUCTS_MS_HOST,
          port: envs.PRODUCTS_MS_PORT,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ProductsService],
})
export class OrdersModule {}
