import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StockService } from './services/stock.service';
import { CollectionQuery, QueryConstructor } from '@chamabet/query';

@ApiBearerAuth()
@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('addToStore')
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get('by-branch/:branchId')
  findByBranch(
    @Param('branchId') branchId: number,
    @Query() query: CollectionQuery
  ) {
    return this.stockService.findByBranch(branchId, query);
  }

  @Get('by-product/:productId')
  findByProduct(@Param('productId') productId: number, @Query() query: CollectionQuery) {
    return this.stockService.findByProduct(productId, query);
  }

  @Get('branch-product/:branchId/:productId')
  findOne(
    @Param('productId') productId: number,
    @Param('branchId') branchId: number
  ) {
    return this.stockService.find(branchId, productId);
  }
  @Get('query')
  findAll(@Query() query: QueryConstructor) {
    return this.stockService.getQuery(query);
  }
}
