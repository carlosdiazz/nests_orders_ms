import { HttpStatus, Inject, Injectable } from '@nestjs/common';
//import { Order } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
//Propio
import { DatabaseService } from 'src/database';
import { lanzarErrorRPC } from 'src/common';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';
import { NATS_SERVER } from 'src/config';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: DatabaseService,
    @Inject(NATS_SERVER) private readonly productsClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const productsIds = createOrderDto.items.map((order) => order.productId);
    try {
      //COnfirmar ids de los productos
      const products: any[] = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'validate_products' },
          { ids: productsIds },
        ),
      );

      //Calculo de los valores
      const totalAmount = createOrderDto.items.reduce((acc, ordemItem) => {
        const price = products.find(
          (product) => product.id === ordemItem.productId,
        ).price;

        return price * ordemItem.quantity + acc;
      }, 0);

      //Total Items
      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //Guardar regsitro de base de dato
      const order = await this.prisma.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (e) {
      console.log(e);
      lanzarErrorRPC(HttpStatus.BAD_REQUEST, 'check logs');
    }
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
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
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
