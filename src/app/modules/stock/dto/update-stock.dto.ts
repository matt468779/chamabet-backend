import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SizeQuantity } from '../entities/sizeQuantity.entity';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @ApiProperty()
  branch: Branch;

  @ApiProperty()
  product: Product;

  @ApiProperty()
  SizeQuantity: SizeQuantity[];
}
