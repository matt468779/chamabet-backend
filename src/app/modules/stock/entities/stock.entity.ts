import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { SizeQuantity } from './sizeQuantity.entity';

@Unique(['branch', 'product'])
@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.stocks, { onDelete: 'CASCADE' })
  branch: Branch;

  @ManyToOne(() => Product, (product) => product.stocks, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.stock)
  sizeQuantity: SizeQuantity[];
}
