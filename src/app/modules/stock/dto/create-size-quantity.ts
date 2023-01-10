import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Stock } from '../entities/stock.entity';

export class CreateSizeQuantity {
  @ApiProperty()
  @IsNumber()
  size: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  stock: Stock;
}
