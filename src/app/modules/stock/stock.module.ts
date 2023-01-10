import { Module, forwardRef } from '@nestjs/common';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { SizeQuantity } from './entities/sizeQuantity.entity';
import { SizeQuantityService } from './services/sizeQuantity.service';
import { StockService } from './services/stock.service';
import { NotificationModule } from '../notification/notification.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [StockController],
  providers: [StockService, SizeQuantityService],
  exports: [StockService, SizeQuantityService],
  imports: [
    ProductModule,
    forwardRef(() => NotificationModule),
    TypeOrmModule.forFeature([Stock, SizeQuantity]),
  ],
})
export class StockModule {}
