import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('redirect')
  redir(@Res() res: Response) {
    res.redirect('https://www.google.com');
  }
}
