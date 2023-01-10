import { PartialType } from '@nestjs/mapped-types';
import { IsBooleanString, IsString } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  address: string | string;

  @ApiPropertyOptional()
  @IsBooleanString()
  isStore: boolean;
}
