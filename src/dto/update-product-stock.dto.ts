import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductStockDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  quantityDelta: number;
}
