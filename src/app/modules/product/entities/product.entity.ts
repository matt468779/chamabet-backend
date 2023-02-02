import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Sale } from '../../sale/entities/sale.entity';
import { Notify } from '../../notification/entities/notify.entity';
import { Deprecate } from '../../deprecate/entities/deprecate.entity';

@Unique(['productId'])
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column({ default: 'No Name' })
  name: string;

  @Column({ default: 'No description' })
  description: string;

  @Column({ default: 'No color' })
  color: string;

  @Column({ default: 0 })
  size: number;

  @Column({ default: 'image' })
  image: string;

  @OneToMany(() => Stock, (stock) => stock.product, { cascade: true })
  stocks: Stock[];

  @OneToMany(() => Assignment, (assignment) => assignment.product, {
    cascade: true,
  })
  assignment: Assignment[];

  @OneToMany(() => Sale, (sale) => sale.product)
  sale: Sale[];

  @OneToMany(() => Notify, (notify) => notify.product)
  notify: Notify[];

  @OneToMany(() => Deprecate, (deprecate) => deprecate.product)
  deprecate: Deprecate[];
}
