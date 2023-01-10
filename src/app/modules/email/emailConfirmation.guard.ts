import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import RequestWithUser from '../auth/requestWithUser.interface';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    if (!req.user?.isEmailConfirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
