import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-assignment.dto';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { IsArray, IsDate, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
  @ApiProperty()
  id: number;

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
