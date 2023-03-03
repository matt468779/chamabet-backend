import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import * as pug from 'pug';
import { Response } from 'express';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async confirmEmail(email: string, res: Response) {
    const user = await this.userService.findByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.userService.markEmailAsConfirmed(email);
    return res.redirect('http://shoesonlyshop.com/admin/');
  }

  async resendConfirmationLink(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TOkenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    return this.emailService.sendMail({
      from: 'noreply@shoesonlyshop.com',
      to: email,
      subject: 'ShoesOnly Email Confirmation',
      html: pug.renderFile('./mail/template.pug', {
        url: url,
      }),
    });
  }
}
