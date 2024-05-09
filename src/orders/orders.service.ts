import { HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';

//Propio
import { DatabaseService } from 'src/database';
import { lanzarErrorRPC } from 'src/common';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';
import { ProductsService } from './products.service';
@Injectable()
export class OrdersService {
  constructor(
    private prisma: DatabaseService,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const idsProducts = createOrderDto.items.map((order) => order.productId);
    const products = this.productsService.create(idsProducts);

    return products;
    //return {
    //  message: 'Ready',
    //  dto: createOrderDto,
    //};
    //return await this.prisma.order.create({ data: createOrderDto });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.prisma.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.prisma.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
    });
    if (!order) {
      lanzarErrorRPC(HttpStatus.NOT_FOUND, `Order not exist`);
    }
    return order;
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
