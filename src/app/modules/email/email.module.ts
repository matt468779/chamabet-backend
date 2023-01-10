import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { EmailConfirmationService } from './emailConfirmation.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { EmailConfirmationController } from './emailConfirmation.controller';

@Module({
  imports: [ConfigModule, JwtModule, UserModule],
  controllers: [EmailController, EmailConfirmationController],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
