import { Module } from '@nestjs/common';
import { DeprecateService } from './deprecate.service';
import { DeprecateController } from './deprecate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deprecate } from './entities/deprecate.entity';
import { StockModule } from '../stock/stock.module';
import { BranchModule } from '../branch/branch.module';

@Module({
  controllers: [DeprecateController],
  providers: [DeprecateService],
  exports: [DeprecateService],
  imports: [TypeOrmModule.forFeature([Deprecate]), StockModule, BranchModule],
})
export class DeprecateModule {}
