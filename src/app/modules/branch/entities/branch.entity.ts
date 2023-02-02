import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Sale } from '../../sale/entities/sale.entity';
import { Notify } from '../../notification/entities/notify.entity';
import { Deprecate } from '../../deprecate/entities/deprecate.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Unknown branch' })
  name: string;

  @Column({ default: false })
  isStore: boolean;

  @OneToMany(() => Stock, (stock) => stock.branch, { cascade: true })
  stocks: Stock[];

  @OneToMany(() => Assignment, (assignment) => assignment.source, {
    cascade: true,
  })
  source: Assignment[];

  @OneToMany(() => Assignment, (assignment) => assignment.destination, {
    cascade: true,
  })
  destination: Assignment[];

  @OneToMany(() => Sale, (sale) => sale.branch, { cascade: true })
  sale: Sale[];

  @Column({ type: 'jsonb', default: {} })
  address: string | string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Notify, (notify) => notify.branch)
  notify: Notify[];

  @OneToMany(() => Deprecate, (deprecate) => deprecate.branch, {
    cascade: true,
  })
  deprecate: Deprecate[];
}
