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
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CollectionQuery } from '@chamabet/query';

@ApiBearerAuth()
@ApiTags('sales')
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('create-sale')
  create(@Body() createSaleDto: CreateSaleDto[]) {
    return this.saleService.create(createSaleDto);
  }

  @Get('get-sales')
  findAll(@Query() query: CollectionQuery) {
    return this.saleService.findAll(query);
  }

  @Get('get-sale/:id')
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(+id);
  }

  @Get('branch/:branchId')
  findByBranch(
    @Param('branchId') branchId: number,
    @Query() query: CollectionQuery
  ) {
    return this.saleService.findByBranch(branchId, query);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId') productId: number,
    @Query() query: CollectionQuery
  ) {
    return this.saleService.findByProduct(productId, query);
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string, @Query() query: CollectionQuery) {
    return this.saleService.findByDate(date, query);
  }

  @Patch('update-sale/:id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.saleService.update(+id, updateSaleDto);
  }

  @Delete('delete-sale/:id')
  remove(@Param('id') id: string) {
    return this.saleService.remove(+id);
  }

  //for report
  @Get('get-sales-report')
  findAllReport(@Query() query: CollectionQuery) {
    return this.saleService.findAllReport(query);
  }
}
