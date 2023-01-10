import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { CollectionQuery } from '@chamabet/query';
import { QueryConstructor } from '@chamabet/query';
import { DataResponseFormat } from 'libs/api-data/src/lib/data-response-format';
import * as fs from 'fs';
import { promisify } from 'util';
@Injectable()
export class ProductService {
  unlinkAsync = promisify(fs.unlink);

  exist = new Product();
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createProduct(product: CreateProductDto): Promise<any> {
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      console.log(error);
      if (error.code !== 'ER_DUP_ENTRY') {
        const message = error['detail'].replace(
          /^Key \((.*)\)=\((.*)\) (.*)/,
          ' $1 is already exists.',
          // ' $1 $2 is already exists.', // $1 for key and $2 for value
        );
        throw new BadRequestException(message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  create(createProductDto: CreateProductDto) {
    try {
      return this.productRepository.save(createProductDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findAll() {
    try {
      return this.productRepository.find();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    // const branch = await this.productRepository.findOneOrFail({
    //   where: { id },
    // });
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.stocks', 'stocks')
      .leftJoinAndSelect('stocks.branch', 'branch')
      .leftJoinAndSelect('stocks.sizeQuantity', 'sizeQuantity')
      .where('product.id = :id', { id })
      .getOne();
    console.log('pr9', product);
    if (!product) {
      return await this.productRepository.findOneBy({ id: id });
    }

    return product;
  }

  findOneOold(id: number) {
    try {
      return this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.stocks', 'stocks')
        .leftJoinAndSelect('stocks.branch', 'branch')
        .leftJoinAndSelect('stocks.sizeQuantity', 'sizeQuantity')
        .where('product.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateProduct(id: number, product: UpdateProductDto): Promise<any> {
    try {
      this.exist = await this.productRepository.findOneBy({ id: id });
      console.log(this.exist);
      if (this.exist != null) {
        if (product.image && this.exist.image !== product.image) {
          try {
            await this.unlinkAsync(`./upload/products/${this.exist.image}`);
          } catch (error) {
            console.log(error);
          }
        }
        this.exist = { ...this.exist, ...product, id: +id };
        console.log('sd', this.exist);

        return await this.productRepository.save(this.exist);
      }
    } catch (error) {
      if (error.code !== 'ER_DUP_ENTRY') {
        // const message = error['detail'].replace(
        //   /^Key \((.*)\)=\((.*)\) (.*)/,
        //   ' $1 is already exists.',
        //   // ' $1 $2 is already exists.', // $1 for key and $2 for value
        // );
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(error.code, error.message);
      }
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      this.productRepository.update(id, updateProductDto);
      return updateProductDto;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    try {
      const product = this.findOne(id);
      this.productRepository.delete(id);
      await this.unlinkAsync(`./upload/products/${(await product).image}`);

      return product;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getQuery(query: CollectionQuery) {
    try {
      const products = await QueryConstructor.constructQuery(
        this.productRepository,
        query,
      ).getMany();

      const response = new DataResponseFormat();
      response.data = products;
      response.count = await this.productRepository.count();
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
