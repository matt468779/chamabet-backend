import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor(configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: configService.get('EMAIL_HOST'),
      port: 2525,
      secure: true,
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    try {
      return this.nodemailerTransport.sendMail(options);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
