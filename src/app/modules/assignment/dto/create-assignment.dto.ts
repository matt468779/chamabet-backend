import { IsArray, IsDate, IsNumber, IsObject } from 'class-validator';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';

export class CreateAssignmentDto {
  @ApiProperty()
  source: Branch;
  @ApiProperty()
  destination: Branch;
  @ApiProperty()
  product: Product;
  @ApiProperty() 
  @IsArray()
  sizeQuantity: SizeQuantity[];
  @ApiProperty()
  @IsDate()
  date: string;
}
