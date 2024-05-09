import { IsUUID } from 'class-validator';

export class FindOneOrderDto {
  @IsUUID()
  id: string;
}
