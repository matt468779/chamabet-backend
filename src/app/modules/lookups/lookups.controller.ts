import { CollectionQuery } from '@chamabet/query';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LookupsDto } from './dto/lookups.dto';
// import { CollectionQuery } from 'libs/collection-query/src/lib/collection-query';
import { LookupsService } from './lookups.service';

@Controller('lookup')
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Get('get-lookups')
  getLookups(@Query() query: CollectionQuery) {
    return this.lookupsService.getLookups(query);
  }
  @Get('get-lookup/:id')
  getLookup(@Param('id') id: string) {
    return this.lookupsService.getLookup(+id);
  }
  @Post('create-lookup')
  createLookup(@Body() lookupDto: LookupsDto) {
    return this.lookupsService.create(lookupDto);
  }
  @Patch('update-lookup/:id')
  updateLookup(@Param('id') id: string, @Body() lookupDto: LookupsDto) {
    return this.lookupsService.update(+id, lookupDto);
  }
  @Delete('delete-lookup/:id')
  deleteLookup(@Param('id') id: string) {
    return this.lookupsService.deleteLookup(+id);
  }
}
