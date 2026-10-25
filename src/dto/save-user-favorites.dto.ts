import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SaveUserFavoritesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  items: string[];
}
