import {
  Get,
  Param,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailConfirmationService } from '../email/emailConfirmation.service';
import { EmailConfirmationGuard } from '../email/emailConfirmation.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    const user: User = await this.userService.findByEmail(req.user.email);
    return { ...user, password: undefined };
  }

  @Get('query')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Query() query) {
    return this.userService.getQuery(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  remove(@Request() req) {
    return this.userService.remove(req.user.username);
  }
}
