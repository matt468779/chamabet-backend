import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EmailConfirmationService } from './emailConfirmation.service';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('email-confirmation')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post()
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() req: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(req.user.email);
  }
}
