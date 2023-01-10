import { IsNumber } from 'class-validator';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SizeQuantity } from '../entities/sizeQuantity.entity';

export class CreateStockDto {
  @ApiProperty()
  branch: Branch;

  @ApiProperty()
  product: Product;

  @ApiProperty()
  sizeQuantity: SizeQuantity[];
}
