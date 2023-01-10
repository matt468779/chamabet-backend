import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { IsArray, IsDate, IsNumber } from 'class-validator';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty()
  branch: Branch;

  @ApiProperty()
  product: Product;

  @ApiProperty()
  @IsArray()
  sizeQuantity: SizeQuantity[];

  @ApiProperty()
  @IsDate()
  date: Date;
}
