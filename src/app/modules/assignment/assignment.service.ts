import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

import { SizeQuantityService } from '../stock/services/sizeQuantity.service';
import { StockService } from '../stock/services/stock.service';
import { BranchService } from '../branch/branch.service';
import { CreateStockDto } from '../stock/dto/create-stock.dto';
import { DataResponseFormat } from '@chamabet/api-data';
import { CollectionQuery, Filter, QueryConstructor } from '@chamabet/query';

@Injectable()
export class AssignmentService {
  totalQuantity = {};
  totalItems = 0;
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    private stockService: StockService,
    private sizeQuantityService: SizeQuantityService,
    private branchService: BranchService
  ) {}
  async create(createAssignmentDto: CreateAssignmentDto) {
    try {
      if (
        (await this.stockService.transfer(
          createAssignmentDto.source,
          createAssignmentDto.destination,
          createAssignmentDto.product,
          createAssignmentDto.sizeQuantity
        )) != null
      ) {
        const createAssignment =
          this.assignmentRepository.create(createAssignmentDto);
        const assignment = await this.assignmentRepository.save(
          createAssignmentDto
        );
        createAssignmentDto.sizeQuantity.forEach((sq) => {
          this.sizeQuantityService.createSizeQuantityForAssignment(
            assignment,
            sq
          );
        });
        return createAssignment;
      } else {
        throw HttpException.createBody(
          'Not enough product in source',
          "The source branch doesn't have enough product to transer",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async addProductsToStore(assignments: CreateAssignmentDto[]) {
    const store = await this.branchService.getStore();
    let stock: CreateStockDto;
    assignments.forEach((assignment) => {
      assignment.source = store;
      assignment.destination = store;

      stock = new CreateStockDto();
      stock.branch = store;
      stock.product = assignment.product;
      stock.sizeQuantity = assignment.sizeQuantity;
      this.assignmentRepository.save(assignment);
      this.stockService.create(stock);
    });
  }

  async findAll() {
    try {
      return await this.assignmentRepository
        .createQueryBuilder('assignment')
        .innerJoinAndSelect('assignment.source', 'source')
        .innerJoinAndSelect('assignment.destination', 'destination')
        .innerJoinAndSelect('assignment.product', 'product')
        .innerJoinAndSelect('assignment.sizeQuantity', 'sizeQuantity')
        .getMany();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.assignmentRepository
        .createQueryBuilder('assignment')
        .leftJoinAndSelect('assignment.source', 'source')
        .leftJoinAndSelect('assignment.destination', 'destination')
        .leftJoinAndSelect('assignment.product', 'product')
        .leftJoinAndSelect('assignment.sizeQuantity', 'sizeQuantity')
        .where('assignment.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findBySource(branchId: number, query: CollectionQuery) {
    try {
      const filter = new Filter();
      filter.field = 'source';
      filter.operator = '=';
      filter.value = branchId;

      if (query.filter) {
        query.filter.concat([[filter]]);
      } else {
        query.filter = [[filter]];
      }

      if (query.includes) {
        query.includes.concat(['product', 'sizeQuantity', 'destination']);
      } else {
        query.includes = ['product', 'sizeQuantity', 'destination'];
      }
      return this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByProduct(productId: number, query: CollectionQuery) {
    try {
      const filter = new Filter();
      filter.field = 'product';
      filter.operator = '=';
      filter.value = productId;

      if (query.filter) {
        query.filter.concat([[filter]]);
      } else {
        query.filter = [[filter]];
      }

      if (query.includes) {
        query.includes.concat(['source', 'destination', 'sizeQuantity']);
      } else {
        query.includes = ['source', 'destination', 'sizeQuantity'];
      }
      return this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByDestination(branchId: number, query: CollectionQuery) {
    try {
      const filter = new Filter();
      filter.field = 'destination';
      filter.operator = '=';
      filter.value = branchId;

      if (query.filter) {
        query.filter.concat([[filter]]);
      } else {
        query.filter = [[filter]];
      }

      if (query.includes) {
        query.includes.concat(['product', 'sizeQuantity', 'source']);
      } else {
        query.includes = ['product', 'sizeQuantity', 'source'];
      }
      return this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    try {
      const assignment: Assignment = await this.findOne(id);
      await this.stockService.transfer(
        assignment.destination,
        assignment.source,
        assignment.product,
        assignment.sizeQuantity
      );
      if (
        (await this.stockService.transfer(
          updateAssignmentDto.source,
          updateAssignmentDto.destination,
          updateAssignmentDto.product,
          updateAssignmentDto.sizeQuantity
        )) != null
      ) {
        updateAssignmentDto.sizeQuantity.forEach(async (sq) => {
          this.sizeQuantityService.createSizeQuantityForAssignment(
            assignment,
            sq
          );
        });
        const upd: UpdateAssignmentDto = {
          ...updateAssignmentDto,
          id: id,
        };
        return await this.assignmentRepository.save(upd);
      } else {
        await this.stockService.transfer(
          assignment.source,
          assignment.destination,
          assignment.product,
          assignment.sizeQuantity
        );

        throw HttpException.createBody(
          'Not enough product in source',
          "The source branch doesn't have enough product to transer. Assignment restored to previous.",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    try {
      const assignment = await this.findOne(id);
      this.stockService.transfer(
        assignment.destination,
        assignment.source,
        assignment.product,
        assignment.sizeQuantity
      );

      return this.assignmentRepository.delete(id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getQuery(query: CollectionQuery) {
    // if (query.includes) {
    //   query.includes = [...query.includes, 'branch', 'product'];
    // } else {
    //   query.includes = ['source', 'product','destination'];
    // }
    try {
      const assignments = await QueryConstructor.constructQuery(
        this.assignmentRepository,
        query
      ).getMany();

      const response = new DataResponseFormat();
      response.data = assignments;
      response.count = await this.assignmentRepository.count();
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getAssignments(query: CollectionQuery) {
    try {
      if (query.includes) {
        query.includes.concat([
          'source',
          'destination',
          'product',
          'sizeQuantity',
        ]);
      } else {
        query.includes = ['source', 'destination', 'product', 'sizeQuantity'];
      }
      return this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  //For report
  async findAllReport(query) {
    this.totalQuantity = {};
    this.totalItems = 0;
    try {
      // if (query.includes) {
      //   query.includes = [...query.includes, 'source', 'product'];
      // } else {
        query.includes = ['source', 'product', 'destination', 'sizeQuantity'];
      // }
      const sales = await this.getQuery(query);
      sales.data.forEach((element: Assignment) => {
        element.sizeQuantity.forEach((item) => {
          this.totalItems += item.quantity;
          if (this.totalQuantity[item.size]) {
            this.totalQuantity[item.size] += item.quantity;
          } else {
            this.totalQuantity[item.size] = item.quantity;
          }
        });
      });
      this.totalQuantity['Total'] = this.totalItems;

      console.log('quantity', this.totalQuantity);
      console.log('sales ', sales);

      return {
        data: sales.data,
        count: sales.count,
        sizeTotal: this.totalQuantity,
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
