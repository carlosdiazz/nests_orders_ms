import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number) //Aqui transformo els tring a numero
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number) //Aqui transformo els tring a numero
  page?: number = 1;
}
