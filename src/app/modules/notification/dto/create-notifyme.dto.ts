import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber } from 'class-validator';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';

export class CreateNotifyMeDto {
  @ApiProperty()
  branch: Branch;
  @ApiProperty()
  product: Product;
  @ApiProperty()
  @IsArray()
  sizeQuantity: SizeQuantity[];
}
