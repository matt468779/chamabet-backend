import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsEmail()
    email: string;
    @IsString()
    username: string;
    @IsString()
    password: string;
}
