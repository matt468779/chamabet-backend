import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from './entities/notify.entity';
import { StockModule } from '../stock/stock.module';
import { NotifyMe } from './entities/notifyme.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([Notify, NotifyMe]),
    forwardRef(() => StockModule),
  ],
})
export class NotificationModule {}
