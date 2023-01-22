import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DeprecateService } from './deprecate.service';
import { CreateDeprecateDto } from './dto/create-deprecate.dto';
import { UpdateDeprecateDto } from './dto/update-deprecate.dto';
import { CollectionQuery } from '@chamabet/query';

@Controller('deprecate')
export class DeprecateController {
  constructor(private readonly deprecateService: DeprecateService) {}

  @Post()
  create(@Body() createDeprecateDtos: CreateDeprecateDto[]) {
    return this.deprecateService.create(createDeprecateDtos);
  }

  @Get()
  findAll(@Query() query: CollectionQuery) {
    return this.deprecateService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deprecateService.findOne(+id);
  }

  @Get('get-by-product/:id')
  findByProduct(@Query() query: CollectionQuery, @Param('id') id: string) {
    return this.deprecateService.findByProduct(+id, query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeprecateDto: UpdateDeprecateDto,
  ) {
    return this.deprecateService.update(+id, updateDeprecateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deprecateService.remove(+id);
  }
}
