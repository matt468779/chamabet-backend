import { Unique } from 'typeorm';
import { IsEmail, IsString } from 'class-validator';
@Unique(['email'])
export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
