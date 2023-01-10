import { ApiProperty } from "@nestjs/swagger";

export class LookupsDto {

  id: number;
  @ApiProperty()
  key: string;
  @ApiProperty()
  value: string;
  @ApiProperty()
  type: string;
}
