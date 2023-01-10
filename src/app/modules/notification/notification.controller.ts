import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notify } from './entities/notify.entity';
import { CreateNotifyMeDto } from './dto/create-notifyme.dto';
import { CollectionQuery } from '@chamabet/query';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotifyMeDto: CreateNotifyMeDto[]) {
    return this.notificationService.createNotifyMe(createNotifyMeDto);
  }

  @Get('get-notify-me-before')
  getNotifyMe(@Query() query: CollectionQuery) {
    return this.notificationService.getNotifcations(query, false);
  }

  @Get('get-notify-me-by-branch/:branchId')
  getNotifyMeByBranch(
    @Param('branchId') branchId: number,
    @Query() query: CollectionQuery,
  ) {
    return this.notificationService.getNotifcationsByBranch(
      branchId,
      query,
      false,
    );
  }

  @Get('get-notify-me-by-product/:productId')
  getNotifyMeByProduct(
    @Param('productId') productId: number,
    @Query() query: CollectionQuery,
  ) {
    return this.notificationService.getNotifcationsByProduct(
      productId,
      query,
      false,
    );
  }

  @Get('get-notifcations')
  getNotifcations(@Query() query: CollectionQuery) {
    return this.notificationService.getNotifcations(query);
  }

  @Get('get-notifcations-by-branch/:branchId')
  getNotificationByBranch(
    @Param('branchId') branchId: number,
    @Query() query: CollectionQuery,
  ) {
    return this.notificationService.getNotifcationsByBranch(branchId, query);
  }

  @Get('get-notifications-by-product/:productId')
  getNotificationByProduct(
    @Param('productId') productId: number,
    @Query() query: CollectionQuery,
  ) {
    return this.notificationService.getNotifcationsByProduct(productId, query);
  }
}
