import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';

@Entity()
export class Deprecate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.assignment, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.deprecate, {
    onDelete: 'CASCADE',
  })
  sizeQuantity: SizeQuantity[];

  @Column({ type: 'date', default: () => 'NOW()' })
  date: string;
}
