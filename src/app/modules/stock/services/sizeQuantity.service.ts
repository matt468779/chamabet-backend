import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SizeQuantity } from '../entities/sizeQuantity.entity';
import { CreateSizeQuantity } from '../dto/create-size-quantity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Sale } from '../../sale/entities/sale.entity';
import { UpdateSizeQuantityDto } from '../dto/update-size-quantity.dto';
import { Product } from '../../product/entities/product.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { NotificationService } from '../../notification/notification.service';
import { Notify } from '../../notification/entities/notify.entity';
import { ProductService } from '../../product/product.service';
import { create } from 'domain';
import { NotifyMe } from '../../notification/entities/notifyme.entity';
import { CreateNotifyMeDto } from '../../notification/dto/create-notifyme.dto';
import { CreateNotificationDto } from '../../notification/dto/create-notification.dto';
import { Deprecate } from '../../deprecate/entities/deprecate.entity';

@Injectable()
export class SizeQuantityService {
  constructor(
    @InjectRepository(SizeQuantity)
    private readonly sizeQuantityRepository: Repository<SizeQuantity>,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async createSizeQuantityForStock(
    product: Product,
    branch: Branch,
    stock: Stock,
    createSizeQuantity: CreateSizeQuantity,
  ) {
    try {
      const sq = await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.stock = :id', { id: stock.id })
        .andWhere('sizeQuantity.size=:size', { size: createSizeQuantity.size })
        .getOne();
      if (sq == null) {
        this.notificationService.checkNotification(
          product,
          branch,
          createSizeQuantity.size,
          createSizeQuantity.quantity,
        );
        return await this.sizeQuantityRepository.save({
          ...createSizeQuantity,
          stock: stock,
        });
      } else {
        this.notificationService.checkNotification(
          product,
          branch,
          createSizeQuantity.size,
          createSizeQuantity.quantity + sq.quantity,
        );
        return await this.sizeQuantityRepository.increment(
          { stock: stock, size: createSizeQuantity.size },
          'quantity',
          createSizeQuantity.quantity,
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createSizeQuantityForAssignment(
    assignment: Assignment,
    createSizeQuantity: CreateSizeQuantity,
  ) {
    try {
      const sq = await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.assignment=:id', { id: assignment.id })
        .andWhere('sizeQuantity.size=:size', { size: createSizeQuantity.size })
        .getOne();

      if (sq) {
        this.sizeQuantityRepository.delete(sq.id);
      }
      return await this.sizeQuantityRepository.save({
        ...createSizeQuantity,
        assignment: assignment,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createSizeQuantityForSale(
    sale: Sale,
    createSizeQuantity: CreateSizeQuantity,
  ) {
    try {
      const sq = await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.sale=:id', { id: sale.id })
        .andWhere('sizeQuantity.size=:size', { size: createSizeQuantity.size })
        .getOne();
      if (sq) {
        this.sizeQuantityRepository.delete(sq.id);
      }
      return await this.sizeQuantityRepository.save({
        ...createSizeQuantity,
        sale: sale,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createSizeQuantityForDeprecate(
    deprecate: Deprecate,
    createSizeQuantity: CreateSizeQuantity,
  ) {
    try {
      const sq = await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.deprecate=:id', { id: deprecate.id })
        .andWhere('sizeQuantity.size=:size', { size: createSizeQuantity.size })
        .getOne();
      if (sq) {
        this.sizeQuantityRepository.delete(sq.id);
      }
      return await this.sizeQuantityRepository.save({
        ...createSizeQuantity,
        deprecate: deprecate,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createSizeQuantityForNotify(
    notify: Notify,
    createSizeQuantity: CreateSizeQuantity,
  ) {
    try {
      const sq = await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.notify=:id', { id: notify.id })
        .andWhere('sizeQuantity.size=:size', { size: createSizeQuantity.size })
        .getOne();
      if (sq) {
        this.sizeQuantityRepository.delete(sq.id);
      }
      return await this.sizeQuantityRepository.save({
        ...createSizeQuantity,
        notify: notify,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createSizeQuantityForNotifyMe(
    notifyme: NotifyMe,
    createSizeQuantity: CreateSizeQuantity,
  ) {
    try {
      const sq = await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.notifyme=:id', { id: notifyme.id })
        .andWhere('sizeQuantity.size=:size', { size: createSizeQuantity.size })
        .getOne();
      if (sq) {
        this.sizeQuantityRepository.delete(sq.id);
      }
      return await this.sizeQuantityRepository.save({
        ...createSizeQuantity,
        notifyme: notifyme,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(stock: Stock, size: number) {
    try {
      return await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.stock=:id', { id: stock.id })
        .andWhere('sizeQuantity.size=:size', { size: size })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOneProduct(notify: Notify) {
    try {
      return await this.sizeQuantityRepository
        .createQueryBuilder('sizeQuantity')
        .where('sizeQuantity.notify=:id', { id: notify.id })
        .getOne();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async decrement(
    product: Product,
    branch: Branch,
    updateSizeQuantityDto: UpdateSizeQuantityDto,
    originalQuantity: number,
  ) {
    try {
      this.notificationService.checkNotification(
        product,
        branch,
        updateSizeQuantityDto.size,
        originalQuantity - updateSizeQuantityDto.quantity,
      );
      return await this.sizeQuantityRepository.decrement(
        {
          stock: updateSizeQuantityDto.stock,
          size: updateSizeQuantityDto.size,
        },
        'quantity',
        updateSizeQuantityDto.quantity,
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  removeNotification(notify: Notify, size: number) {
    return this.sizeQuantityRepository
      .createQueryBuilder('sizeQuantity')
      .where('sizeQuantity.notify=:id', { id: notify.id })
      .andWhere('sizeQuantity.size=:size', { size: size })
      .delete();
  }
}
