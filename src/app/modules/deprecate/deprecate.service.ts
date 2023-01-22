import { Injectable, BadRequestException, Query } from '@nestjs/common';
import { CreateDeprecateDto } from './dto/create-deprecate.dto';
import { UpdateDeprecateDto } from './dto/update-deprecate.dto';
import { StockService } from '../stock/services/stock.service';
import { Deprecate } from './entities/deprecate.entity';
import { Repository } from 'typeorm';
import { SizeQuantityService } from '../stock/services/sizeQuantity.service';
import { BranchService } from '../branch/branch.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionQuery, QueryConstructor, Filter } from '@chamabet/query';
import { DataResponseFormat } from '@chamabet/api-data';
import { CreateStockDto } from '../stock/dto/create-stock.dto';

@Injectable()
export class DeprecateService {
  constructor(
    @InjectRepository(Deprecate)
    private deprecateRepository: Repository<Deprecate>,
    private stockService: StockService,
    private sizeQuantityService: SizeQuantityService,
    private branchService: BranchService,
  ) {}

  async create(createDeprecateDtos: CreateDeprecateDto[]) {
    const store = await this.branchService.getStore();
    try {
      createDeprecateDtos.forEach(async (createDeprecateDto) => {
        if (
          await this.stockService.subtract({
            ...createDeprecateDto,
            branch: store,
          })
        ) {
          const deprecate = await this.deprecateRepository.save({
            ...createDeprecateDto,
            sizeQuantity: undefined,
          });
          createDeprecateDto.sizeQuantity.forEach((sq) => {
            this.sizeQuantityService.createSizeQuantityForDeprecate(
              deprecate,
              sq,
            );
          });
          await this.deprecateRepository.save(deprecate);
        } else {
          throw new BadRequestException(
            "The branch doesn't have enough product to sell",
          );
        }
      });
      return createDeprecateDtos;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findAll(query: CollectionQuery) {
    query.includes = ['sizeQuantity', 'product'];
    return this.getQuery(query);
  }

  async findByProduct(productId: number, query: CollectionQuery) {
    try {
      query.includes = ['sizeQuantity'];
      const filter = new Filter();
      filter.field = 'product';
      filter.operator = '=';
      filter.value = productId;

      if (query.filter) {
        query.filter.concat([[filter]]);
      } else {
        query.filter = [[filter]];
      }

      return await this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.deprecateRepository
        .createQueryBuilder('deprecate')
        .leftJoinAndSelect('deprecate.product', 'product')
        .leftJoinAndSelect('deprecate.sizeQuantity', 'sizeQuantity')
        .where('deprecate.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: number, updateDeprecateDto: UpdateDeprecateDto) {
    try {
      const deprecate: Deprecate = await this.findOne(id);
      const store = await this.branchService.getStore();
      const createStockDto: CreateStockDto = { ...deprecate, branch: store };
      await this.stockService.create(createStockDto);
      if (
        await this.stockService.subtract({
          ...updateDeprecateDto,
          branch: store,
        })
      ) {
        const updated = await this.deprecateRepository.update(id, {
          ...updateDeprecateDto,
          sizeQuantity: undefined,
        });
        updateDeprecateDto.sizeQuantity.forEach(async (sq) => {
          await this.sizeQuantityService.createSizeQuantityForDeprecate(
            deprecate,
            sq,
          );
        });
        return this.findOne(id);
      } else {
        this.stockService.subtract({
          ...deprecate,
          branch: store,
        });
        throw new BadRequestException(
          "The branch doesn't have enough product to deprecate",
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    const deprecate: Deprecate = await this.findOne(id);
    const store = await this.branchService.getStore();
    const createStockDto: CreateStockDto = { ...deprecate, branch: store };
    await this.stockService.create(createStockDto);

    return await this.deprecateRepository.remove(deprecate);
  }

  async getQuery(query: CollectionQuery) {
    try {
      const deprecates = await QueryConstructor.constructQuery(
        this.deprecateRepository,
        query,
      ).getMany();

      const response = new DataResponseFormat();
      response.data = deprecates;
      response.count = await this.deprecateRepository.count();
      return response;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
