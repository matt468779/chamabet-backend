import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { Collection, Repository } from 'typeorm';

import { SizeQuantityService } from '../stock/services/sizeQuantity.service';
import { StockService } from '../stock/services/stock.service';
import { DataResponseFormat } from '@chamabet/api-data';
import { CollectionQuery, QueryConstructor, Filter } from '@chamabet/query';

@Injectable()
export class SaleService {
  totalQuantity: { [key: string]: any } = {};
  totalItems = 0;
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    private stockService: StockService,
    private sizeQuantityService: SizeQuantityService,
  ) {}

  async create(createSaleDtos: CreateSaleDto[]) {
    try {
      createSaleDtos.forEach(async (createSaleDto) => {
        if (await this.stockService.subtract({ ...createSaleDto })) {
          const sale = await this.saleRepository.save({
            ...createSaleDto,
            sizeQuantity: undefined,
          });
          createSaleDto.sizeQuantity.forEach((sq) => {
            this.sizeQuantityService.createSizeQuantityForSale(sale, sq);
          });
          await this.saleRepository.save(sale);
        } else {
          throw new BadRequestException(
            "The branch doesn't have enough product to sell",
          );
        }
      });
      return createSaleDtos;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    try {
      const sale: Sale = await this.findOne(id);

      await this.stockService.create({ ...sale });
      if (await this.stockService.subtract(updateSaleDto)) {
        const updated = await this.saleRepository.update(id, {
          ...updateSaleDto,
          sizeQuantity: undefined,
        });
        updateSaleDto.sizeQuantity.forEach(async (sq) => {
          await this.sizeQuantityService.createSizeQuantityForSale(sale, sq);
        });
        return this.findOne(id);
      } else {
        await this.stockService.subtract(sale);
        throw new BadRequestException(
          "The branch doesn't have enough product to sell",
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    try {
      const sale: Sale = await this.findOne(id);
      this.stockService.create(sale);
      return this.saleRepository.delete(id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getQuery(query: CollectionQuery) {
    try {
      const sales = await QueryConstructor.constructQuery(
        this.saleRepository,
        query,
      ).getMany();

      const response = new DataResponseFormat();
      response.data = sales;
      response.count = await this.saleRepository.count();
      return response;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findAll(query) {
    try {
      if (query.includes) {
        query.includes = [...query.includes, 'branch', 'product'];
      } else {
        query.includes = ['branch', 'product'];
      }
      return await this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.saleRepository
        .createQueryBuilder('sale')
        .leftJoinAndSelect('sale.branch', 'branch')
        .leftJoinAndSelect('sale.product', 'product')
        .leftJoinAndSelect('sale.sizeQuantity', 'sizeQuantity')
        .where('sale.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByBranch(branchId: number, query: CollectionQuery) {
    try {
      const filter = new Filter();
      filter.field = 'branch';
      filter.operator = '=';
      filter.value = branchId;

      if (query.filter) {
        query.filter.concat([[filter]]);
      } else {
        query.filter = [[filter]];
      }

      if (query.includes) {
        query.includes.concat(['product', 'sizeQuantity']);
      } else {
        query.includes = ['product', 'sizeQuantity'];
      }
      return await this.getQuery(query);
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
        query.includes.concat(['branch', 'sizeQuantity']);
      } else {
        query.includes = ['branch', 'sizeQuantity'];
      }
      return await this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByDate(date: string, query: CollectionQuery) {
    try {
      const filter = new Filter();
      filter.field = 'date';
      filter.operator = '=';
      filter.value = date;

      if (query.filter) {
        query.filter.concat([[filter]]);
      } else {
        query.filter = [[filter]];
      }

      if (query.includes) {
        query.includes.concat(['branch', 'product', 'sizeQuantity']);
      } else {
        query.includes = ['branch', 'product', 'sizeQuantity'];
      }

      return await this.getQuery(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  //For report
  async findAllReport(query) {
    this.totalQuantity = {};
    this.totalItems = 0;
    try {
      if (query.includes) {
        query.includes = [...query.includes, 'branch', 'product'];
      } else {
        query.includes = ['branch', 'product', 'sizeQuantity'];
      }
      const sales = await this.getQuery(query);
      sales.data.forEach((element: Sale) => {
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
