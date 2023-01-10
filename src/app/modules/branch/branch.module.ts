import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
  imports: [TypeOrmModule.forFeature([Branch])]
})

export class BranchModule {}
