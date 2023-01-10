import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { StockModule } from '../stock/stock.module';
import { BranchModule } from '../branch/branch.module';

@Module({
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
  imports: [TypeOrmModule.forFeature([Assignment]), StockModule, BranchModule],
})
export class AssignmentModule {}
