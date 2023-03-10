import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Stock } from './stock.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Sale } from '../../sale/entities/sale.entity';
import { Notify } from '../../notification/entities/notify.entity';
import { NotifyMe } from '../../notification/entities/notifyme.entity';
import { Deprecate } from '../../deprecate/entities/deprecate.entity';

@Entity()
export class SizeQuantity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  size: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Stock, (stock) => stock.sizeQuantity, {
    onDelete: 'CASCADE',
  })
  stock: Stock;

  @ManyToOne(() => Assignment, (assignment) => assignment.sizeQuantity, {
    onDelete: 'CASCADE',
  })
  assignment: Assignment;

  @ManyToOne(() => Sale, (sale) => sale.sizeQuantity, { onDelete: 'CASCADE' })
  sale: Sale;

  @ManyToOne(() => NotifyMe, (notifyme) => notifyme.sizeQuantity)
  notifyme: NotifyMe;

  @ManyToOne(() => Deprecate, (deprecate) => deprecate.sizeQuantity, {
    onDelete: 'CASCADE',
  })
  deprecate: Deprecate;
}
