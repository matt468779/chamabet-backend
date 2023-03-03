import { Unique } from 'typeorm';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
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
  @IsBoolean()
  isActivated: boolean;
}
