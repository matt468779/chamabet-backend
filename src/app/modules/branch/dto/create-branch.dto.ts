import { IsBooleanString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Branch } from '../entities/branch.entity';

export class CreateBranchDto extends PartialType(Branch) {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  address: string | string;

  @ApiProperty()
  @IsBooleanString()
  isStore: boolean;
}
