import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

class CartItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;
}

export class AddProductCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [CartItemDto] })
  @IsNotEmpty()
  items: CartItemDto[];
}
