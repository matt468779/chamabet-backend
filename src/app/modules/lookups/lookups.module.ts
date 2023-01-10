import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lookups } from "./entities/lookups.entity";
import { LookupsController } from "./lookups.controller";
import { LookupsService } from "./lookups.service";


@Module({
  controllers: [LookupsController],
  providers: [LookupsService],
  exports: [LookupsService],
  imports: [
    TypeOrmModule.forFeature([Lookups]),

  ],
})
export class LookupsModule {}
