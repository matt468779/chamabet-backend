import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Lookups } from './entities/lookups.entity';
import { LookupsDto } from './dto/lookups.dto';
import { CollectionQuery, QueryConstructor } from '@chamabet/query';
import { DataResponseFormat } from '@chamabet/api-data';

@Injectable()
export class LookupsService {
  constructor(
    @InjectRepository(Lookups)
    private lookupsRepository: Repository<Lookups>
  ) {}

  async getLookups(query: CollectionQuery) {
    try {
      const notifications = await QueryConstructor.constructQuery(
        this.lookupsRepository,
        query
      ).getManyAndCount();

      const response = new DataResponseFormat();
      response.data = notifications[0];
      response.count = notifications[1];
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getLookup(id: number) {
    try {
      const isFound = await this.lookupsRepository.findOneBy({ id: id });
      if (!isFound) {
        throw new NotFoundException(` Lookup with ${id} not found`);
      }
      return isFound;
    } catch (error) {
      throw new Error(` Lookup with ${id} not found`);
    }
  }
  create(lookupsDto: LookupsDto) {
    try {
      return this.lookupsRepository.save(lookupsDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  update(id: number, lookupsDto: LookupsDto) {
    try {
      this.lookupsRepository.update(id, lookupsDto);
      return lookupsDto;
    } catch (error) {
      throw new BadRequestException();
    }
  }
  async deleteLookup(id: number): Promise<any> {
    try {
      const isFound = await this.lookupsRepository.findOneBy({ id: id });
      if (!isFound) {
        throw new NotFoundException(` Lookup with ${id} not found`);
      }
      await this.lookupsRepository.delete(id);

      return isFound;
    } catch (error) {
      throw new Error(error);
    }
  }
}
