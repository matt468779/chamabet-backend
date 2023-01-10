import { ApiProperty } from '@nestjs/swagger';

export class DataResponseFormat<T> {
  @ApiProperty()
  count!: number;
  @ApiProperty({ isArray: true })
  data!: T[];
}
