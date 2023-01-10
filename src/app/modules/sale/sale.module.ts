import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sale/entities/sale.entity';
import { StockModule } from '../stock/stock.module';

@Module({
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
  imports: [TypeOrmModule.forFeature([Sale]), StockModule],
})
export class SaleModule {}
