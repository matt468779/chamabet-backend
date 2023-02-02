import { PartialType } from '@nestjs/mapped-types';
import { CreateDeprecateDto } from './create-deprecate.dto';
import { IsArray, IsDate } from 'class-validator';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';
import { Branch } from '../../branch/entities/branch.entity';

export class UpdateDeprecateDto extends PartialType(CreateDeprecateDto) {
  @ApiProperty()
  product: Product;
  @ApiProperty()
  branch: Branch;
  @ApiProperty()
  @IsArray()
  sizeQuantity: SizeQuantity[];
  @ApiProperty()
  @IsDate()
  date: string;
}
