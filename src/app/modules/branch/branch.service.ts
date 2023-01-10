import { DataResponseFormat } from '@chamabet/api-data';
import { CollectionQuery, Filter, QueryConstructor } from '@chamabet/query';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, MoreThan } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';


@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>
  ) {}

  create(createBranchDto: CreateBranchDto) {
    try {
      return this.branchRepository.save(createBranchDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getBranches(query: CollectionQuery) {
    try {
      const branches = await QueryConstructor.constructQuery(
        this.branchRepository,
        query
      ).getMany();

      const response = new DataResponseFormat();
      response.data = branches;
      response.count = await this.branchRepository.count();
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }
  async getAllBranchesWithProducts(query: CollectionQuery) {
    try {
      return this.branchRepository
      .createQueryBuilder('branch')
      .leftJoinAndSelect('branch.stocks', 'stocks')
      .leftJoinAndSelect('stocks.product', 'product')
      .leftJoinAndSelect('stocks.sizeQuantity', 'sizeQuantity').getMany();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findOne(id: number) {
    try {
      return this.branchRepository
        .createQueryBuilder('branch')
        .leftJoinAndSelect('branch.stocks', 'stocks')
        .leftJoinAndSelect('stocks.product', 'product')
        .leftJoinAndSelect('stocks.sizeQuantity', 'sizeQuantity')
        .where('branch.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getStock(id: string, query: CollectionQuery) {
    // try {
    query.includes = ['stocks', 'product'];
    const filter = new Filter();
    filter.field = 'branch.id';
    filter.operator = '=';
    filter.value = id;
    query.filter = [[filter]];
    const branches = await QueryConstructor.constructQuery(
      this.branchRepository,
      query
    ).getManyAndCount();

    const response = new DataResponseFormat();
    response.data = branches[0];
    response.count = branches[1];
    return response;
    // } catch (error) {
    //   throw new BadRequestException();
    // }
  }

  async getStore() {
    return await this.branchRepository.findOne({ where: { isStore: true } });
  }

  findSales(id: number, isDelivery: boolean) {
    try {
      return this.branchRepository
        .createQueryBuilder('branch')
        .leftJoinAndSelect('branch.sale', 'sale')
        .leftJoinAndSelect('sale.product', 'product')
        .leftJoinAndSelect('sale.sizeQuantity', 'sizeQuantity')
        .where('branch.id = :id', { id })
        .andWhere('sale.isDelivery = :isDelivery', { isDelivery })
        .getMany();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    try {
      this.branchRepository.update(id, updateBranchDto);
      return updateBranchDto;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async deleteBranch(
    id: number
  ): Promise<any> {
    try {
      const isFound = await this.branchRepository.findOneBy({id:id});
      if (!isFound) {
        throw new NotFoundException(` Branch with ${id} not found`);
      }
      await this.branchRepository.delete(id);

      return isFound;
    } catch (error) {
      throw new Error(error);
    }
  }

  // remove(id: number) {
  //   try {
  //     const branch = this.findOne(id);
  //     this.branchRepository.delete(id);
  //     return branch;
  //   } catch (error) {
  //     throw new BadRequestException();
  //   }
  // }
}
