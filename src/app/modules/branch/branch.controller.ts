import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CollectionQuery, QueryConstructor } from '@chamabet/query';


@ApiBearerAuth()
@ApiTags('branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('create-branch')
  @UseGuards(RoleGuard(Role.Admin))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get('get-branches')
  @UseGuards(RoleGuard(Role.Admin))
  findAll(@Query() query: CollectionQuery) {
    return this.branchService.getBranches(query);
  }

  @Get('get-branch/:id')
  @UseGuards(RoleGuard(Role.Admin))
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Patch('update-branch/:id')
  @UseGuards(RoleGuard(Role.Admin))
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete('delete-branch/:id')
  @UseGuards(RoleGuard(Role.Admin))
  remove(@Param('id') id: string) {
    return this.branchService.deleteBranch(+id);
  }

  @Get('get-stock/:id')
  getStock(@Param('id') id: string, @Query() query: QueryConstructor) {
    return this.branchService.getStock(id, query);
  }
  @Get('get-branch-with-product')
  getBranchWithProduct(@Query() query: QueryConstructor) {
    return this.branchService.getAllBranchesWithProducts(query);
  }

  @Get('sale/:id')
  @UseGuards(RoleGuard(Role.Admin))
  findSales(@Param('id') id: string) {
    return this.branchService.findSales(+id, false);
  }

  @Get('delivery/:id')
  @UseGuards(RoleGuard(Role.Admin))
  findDeliveries(@Param('id') id: string) {
    return this.branchService.findSales(+id, true);
  }
}
