import { IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  color: string;   
 
  @ApiProperty()
  @IsNumber()
  size: number;

  @ApiPropertyOptional()
  @IsString()
  image: string;
}
