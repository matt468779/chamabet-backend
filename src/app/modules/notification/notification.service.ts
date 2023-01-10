import {
  Injectable,
  BadRequestException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notify } from './entities/notify.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { NotifyMe } from './entities/notifyme.entity';
import { SizeQuantityService } from '../stock/services/sizeQuantity.service';
import { CreateNotifyMeDto } from './dto/create-notifyme.dto';
import { Branch } from '../branch/entities/branch.entity';
import { Product } from '../product/entities/product.entity';
import { CollectionQuery, Filter, QueryConstructor } from '@chamabet/query';
import { DataResponseFormat } from '@chamabet/api-data';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notify) private notifyRepository: Repository<Notify>,
    @InjectRepository(NotifyMe)
    private notifyMeRepository: Repository<NotifyMe>,
    @Inject(forwardRef(() => SizeQuantityService))
    private sizeQuantityService: SizeQuantityService
  ) {}

  async findOne(branch: Branch, product: Product, size: number) {
    return await this.notifyMeRepository
      .createQueryBuilder('notifyme')
      .leftJoinAndSelect('notifyme.branch', 'branch')
      .leftJoinAndSelect('notifyme.product', 'product')
      .leftJoinAndSelect('notifyme.sizeQuantity', 'sizeQuantity')
      .where('notifyme.branch = :branchId', {
        branchId: branch.id,
      })
      .andWhere('notifyme.product = :productId', {
        productId: product.id,
      })
      .andWhere('sizeQuantity.size=:size', { size: size })
      .getOne();
  }

  async getNotifcations(query: CollectionQuery, notifications = true) {
    try {
      if (query.includes) {
        query.includes.concat(['product', 'branch', 'sizeQuantity']);
      } else {
        query.includes = ['product', 'branch', 'sizeQuantity'];
      }

      return notifications
        ? await this.getQueryNotify(query)
        : await this.getQueryNotifyMe(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getNotifcationsByBranch(
    branchId: number,
    query: CollectionQuery,
    notifications = true
  ) {
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
      return notifications
        ? await this.getQueryNotify(query)
        : await this.getQueryNotifyMe(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getNotifcationsByProduct(
    productId: number,
    query: CollectionQuery,
    notifications = true
  ) {
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
      return notifications
        ? await this.getQueryNotify(query)
        : await this.getQueryNotifyMe(query);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async removeNotifcation(notify: CreateNotifyMeDto) {
    const notification = await this.notifyRepository
      .createQueryBuilder('notify')
      .where('notify.product=:id', { id: notify.product.id })
      .andWhere('notify.branch=:branch', { branch: notify.branch.id })
      .getOne();
    if (notification) {
      return this.notifyRepository.delete(notification.id);
    }
  }

  async createNotifyMe(createNotifyMeDtos: CreateNotifyMeDto[]) {
    // try {
    createNotifyMeDtos.forEach(async (createNotifyMe) => {
      let notifyme = await this.notifyMeRepository
        .createQueryBuilder('notifyme')
        .leftJoinAndSelect('notifyme.branch', 'branch')
        .leftJoinAndSelect('notifyme.product', 'product')
        .where('notifyme.branch = :branchId', {
          branchId: createNotifyMe.branch.id,
        })
        .andWhere('notifyme.product = :productId', {
          productId: createNotifyMe.product.id,
        })
        .getOne();

      if (!notifyme) {
        notifyme = await this.notifyMeRepository.save({
          ...createNotifyMe,
          sizeQuantity: undefined,
        });
      }
      createNotifyMe.sizeQuantity.forEach((sq) => {
        this.sizeQuantityService.createSizeQuantityForNotifyMe(notifyme, sq);
      });
    });
    return createNotifyMeDtos;
    // } catch (error) {
    //   throw new BadRequestException();
    // }
  }

  async createNotify(createNotifyDto: CreateNotifyMeDto) {
    // try {
    Logger.log('no notifey');

    let notify = await this.notifyRepository
      .createQueryBuilder('notify')
      .leftJoinAndSelect('notify.branch', 'branch')
      .leftJoinAndSelect('notify.product', 'product')
      .where('notify.branch = :branchId', {
        branchId: createNotifyDto.branch.id,
      })
      .andWhere('notify.product = :productId', {
        productId: createNotifyDto.product.id,
      })
      .getOne();
    Logger.log('no notifey');

    if (!notify) {
      notify = await this.notifyRepository.save({
        ...createNotifyDto,
        sizeQuantity: undefined,
      });
    }
    createNotifyDto.sizeQuantity.forEach((sq) => {
      this.sizeQuantityService.createSizeQuantityForNotify(notify, sq);
    });

    return createNotifyDto;
    // } catch (error) {
    //   throw new BadRequestException();
    // }
  }

  async getQueryNotify(query: CollectionQuery) {
    try {
      const notifications = await QueryConstructor.constructQuery(
        this.notifyRepository,
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

  async getQueryNotifyMe(query: CollectionQuery) {
    try {
      const notifications = await QueryConstructor.constructQuery(
        this.notifyMeRepository,
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
}
