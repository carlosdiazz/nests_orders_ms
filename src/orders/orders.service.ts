import { Injectable } from '@nestjs/common';

//Propio
import { CreateOrderDto } from './dto/create-order.dto';
import { DatabaseService } from 'src/database';
//import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: DatabaseService) {}

  async create(createOrderDto: CreateOrderDto) {
    console.log(createOrderDto);
    return 'This action adds a new order';
  }

  async findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    console.log(id);
    return `This action returns a #${id} order`;
  }
}
