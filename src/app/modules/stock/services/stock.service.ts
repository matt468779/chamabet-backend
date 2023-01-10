import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SizeQuantityService } from './sizeQuantity.service';
import { Stock } from '../entities/stock.entity';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateSizeQuantityDto } from '../dto/update-size-quantity.dto';
import { Product } from '../../product/entities/product.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { SizeQuantity } from '../entities/sizeQuantity.entity';
import { DataResponseFormat } from '@chamabet/api-data';
import { CollectionQuery, Filter, QueryConstructor } from '@chamabet/query';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly sizeQuantityService: SizeQuantityService
  ) {}
  async create(createStockDto: CreateStockDto) {
    // try {
    let stock: Stock = await this.findOne(
      createStockDto.branch,
      createStockDto.product
    );
    if (!stock) {
      stock = this.stockRepository.create({
        ...createStockDto,
        sizeQuantity: undefined,
      });
      await this.stockRepository.save(stock);
    }
    createStockDto.sizeQuantity.forEach(async (sq) => {
      await this.sizeQuantityService.createSizeQuantityForStock(
        createStockDto.product,
        stock.branch,
        stock,
        sq
      );
    });

    return { message: 'success' };
    //   } catch (error) {
    //     throw new BadRequestException();
    //   }
  }

  async subtract(createStockDto: CreateStockDto) {
    try {
      const stock = await this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.sizeQuantity', 'sizeQuantity')
        .leftJoinAndSelect('stock.branch', 'branch')
        .where('stock.product=:productId', {
          productId: createStockDto.product.id,
        })
        .andWhere('stock.branch.id=:branchId', {
          branchId: createStockDto.branch.id,
        })
        .getOne();

      let isProductEnough = true;
      const sizeQuantity = {};
      stock.sizeQuantity.forEach((sq) => {
        sizeQuantity[sq.size] = sq.quantity;
      });

      for (const sq of createStockDto.sizeQuantity) {
        if (sizeQuantity[sq.size] < sq.quantity) {
          isProductEnough = false;
          break;
        }
      }

      if (!isProductEnough) {
        return false;
      }

      createStockDto.sizeQuantity.forEach(async (sq) => {
        const updateSq = new UpdateSizeQuantityDto();
        updateSq.quantity = sq.quantity;
        updateSq.size = sq.size;
        updateSq.stock = stock;
        await this.sizeQuantityService.decrement(
          createStockDto.product,
          stock.branch,
          updateSq,
          sizeQuantity[sq.size]
        );
      });
      return true;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(branch: Branch, product: Product) {
    try {
      return this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.product', 'product')
        .leftJoinAndSelect('stock.branch', 'branch')
        .leftJoinAndSelect('stock.sizeQuantity', 'sizeQuantity')
        .where('stock.branch=:branch', { branch: branch.id })
        .andWhere('stock.product=:product', { product: product.id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findAll() {
    try {
      return this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.product', 'product')
        .leftJoinAndSelect('stock.branch', 'branch')
        .leftJoinAndSelect('stock.sizeQuantity', 'sizeQuantity')
        .getManyAndCount();
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

      // const filter2 = new Filter();
      // filter2.field = 'sizeQuantity.quantity';
      // filter2.operator = '>';
      // filter2.value = 0;

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
      console.log(query.filter);

      const stock = await QueryConstructor.constructQuery(
        this.stockRepository,
        query
      ).getManyAndCount();

      const response = new DataResponseFormat();
      response.data = stock[0];
      response.count = stock[1];
      return response;
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

      // const filter2 = new Filter();
      // filter2.field = 'sizeQuantity.quantity';
      // filter2.operator = '>';
      // filter2.value = 0;

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

      const stock = await QueryConstructor.constructQuery(
        this.stockRepository,
        query
      ).getManyAndCount();

      const response = new DataResponseFormat();
      response.data = stock[0];
      response.count = stock[1];
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findOnes(branchId: number, productId: number, size: number) {
    try {
      return this.stockRepository
        .createQueryBuilder('stock')
        .innerJoin('stock.branch', 'branch')
        .innerJoin('stock.product', 'product')
        .innerJoin('stock.sizeQuantity', 'sizeQuantity')
        .where('stock.product = :productId', { productId })
        .where('stock.branch = :branchId', { branchId })
        .where('stock.sizeQuantity.size = :size', { size })
        .select('stock.id')
        .addSelect('branch')
        .addSelect('stock.sizeQuantity')
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  find(branchId: number, productId: number) {
    try {
      return this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.branch', 'branch')
        .leftJoinAndSelect('stock.product', 'product')
        .leftJoinAndSelect('stock.sizeQuantity', 'sizeQuantity')
        .where('stock.product = :productId', { productId })
        .andWhere('stock.branch = :branchId', { branchId })
        .select('stock.id')
        .addSelect('sizeQuantity')
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    try {
      return this.stockRepository.update(id, updateStockDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  remove(id: number) {
    try {
      return this.stockRepository.delete(id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async transfer(
    source: Branch,
    destination: Branch,
    product: Product,
    sizeQuantity: SizeQuantity[]
  ) {
    try {
      const sourceBranch = new CreateStockDto();
      sourceBranch.branch = source;
      sourceBranch.sizeQuantity = sizeQuantity;
      sourceBranch.product = product;
      const sub = await this.subtract(sourceBranch);
      if (sub != false) {
        const destinationBranch = new CreateStockDto();
        destinationBranch.branch = destination;
        destinationBranch.sizeQuantity = sizeQuantity;
        destinationBranch.product = product;
        return await this.create(destinationBranch);
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  async getQuery(query: CollectionQuery) {
    try {
      const products = await QueryConstructor.constructQuery(
        this.stockRepository,
        query
      ).getMany();

      const response = new DataResponseFormat();
      response.data = products;
      response.count = await this.stockRepository.count();
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
