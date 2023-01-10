import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { FilterOperators } from './filter_operators';
export class CollectionQuery {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  top?: number;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  skip?: number;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  orderBy?: Order[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  searchFrom?: string[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  filter?: Filter[][];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  includes?: string[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  select?: string[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  locale?: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  groupBy?: string[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  count?: boolean;
}
enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class Order {
  @ApiProperty()
  @IsString()
  field?: string;
  @ApiProperty()
  @IsEnum(Direction, {
    message: 'Direction must be either ASC or DESC',
  })
  direction?: string;
}

export class Filter {
  @ApiProperty()
  @IsString()
  field!: string;
  @ApiProperty()
  @IsString()
  value?: any;
  @ApiProperty()
  @IsEnum(FilterOperators, {
    message: `Operator must be one of ${Object.keys(
      FilterOperators
    ).toString()}`,
  })
  operator?: string;
}
