import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  color: string;

  @ApiPropertyOptional()
  @IsNumber()
  size: number;

  @ApiPropertyOptional()
  @IsString()
  image: string;
}
