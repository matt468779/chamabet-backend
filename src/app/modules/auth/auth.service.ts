import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      try {
        const createdUser = await this.userService.create({
          ...createUserDto,
          password: hashedPassword,
        });
        return createdUser;
      } catch (error) {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async login(user: User) {
    try {
      const payload = {
        sub: user.email,
        role: user.role,
        isEmailConfirmed: user.isEmailConfirmed,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
