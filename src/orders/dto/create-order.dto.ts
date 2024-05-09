import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  //@IsNumber()
  //@IsPositive()
  //totalAmount: number;
  //
  //@IsNumber()
  //@IsPositive()
  //totalItems: number;
  //
  //@IsOptional()
  //@IsEnum(OrderStatusList, {
  //  message: `Possible status values are ${OrderStatusList}`,
  //})
  //status: OrderStatus = OrderStatus.PENDING;
  //
  //@IsOptional()
  //@IsBoolean()
  //paid: boolean = false;

  @IsArray()
  @ArrayMinSize(1)
  //Validar internamente los elementos que vienen
  @ValidateNested({ each: true })
  //Cada Itereacion la va a transformar a mi DTO
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
