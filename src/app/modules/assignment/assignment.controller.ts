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
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CollectionQuery } from '@chamabet/query';

@ApiBearerAuth()
@ApiTags('assignment')
@Controller('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Post('create-assignment')
  create(@Body() createAssignmentDto: CreateAssignmentDto[]) {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Post('add-to-store')
  addProductsToStore(@Body() createAssignmentDto: CreateAssignmentDto[]) {
    return this.assignmentService.addProductsToStore(createAssignmentDto);
  }

  @Post('deprecate')
  deprecate(@Body() createAssignmentDto: CreateAssignmentDto[]) {
    return this.assignmentService.deprecate(createAssignmentDto);
  }

  @Get('get-assignments')
  findAll(@Query() query: CollectionQuery) {
    return this.assignmentService.getAssignments(query);
  }
  @Get('get-assignments-report')
  findAllReport(@Query() query: CollectionQuery) {
    return this.assignmentService.findAllReport(query);
  }

  @Get('get-by-source/:id')
  findBySource(@Param('id') id: number, @Query() query: CollectionQuery) {
    return this.assignmentService.findBySource(id, query);
  }

  @Get('get-by-destination/:id')
  findByDestination(@Param('id') id: number, @Query() query: CollectionQuery) {
    return this.assignmentService.findByDestination(id, query);
  }

  @Get('get-by-product/:id')
  findByProduct(@Param('id') id: number, @Query() query: CollectionQuery) {
    return this.assignmentService.findByProduct(id, query);
  }

  @Get('get-assignment/:id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(+id);
  }

  @Patch('update-assignment/:id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentService.update(+id, updateAssignmentDto);
  }

  @Delete('delete-assignment/:id')
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(+id);
  }
}
