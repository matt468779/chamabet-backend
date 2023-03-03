import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmailConfirmationService } from './emailConfirmation.service';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('email-confirmation')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get()
  async confirm(@Query() query, @Res() res: Response) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      query.token,
    );
    return await this.emailConfirmationService.confirmEmail(email, res);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() req: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(req.user.email);
  }
}
