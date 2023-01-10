import {
  BadRequestException,
  Body,
  Controller,
  Header,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EmailConfirmationService } from '../email/emailConfirmation.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly userService: UserService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
    return { message: 'Logged out successfully' };
  }

  @Post('user')
  async create(@Body() createUserDto: CreateUserDto) {
    if (!(await this.userService.findByEmail(createUserDto.email))) {
      this.emailConfirmationService.sendVerificationLink(createUserDto.email);
      return this.userService.create(createUserDto);
    } else {
      return new BadRequestException('Email already has an account');
    }
  }
}
