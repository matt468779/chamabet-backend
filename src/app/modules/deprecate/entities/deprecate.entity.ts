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

  @ManyToOne(() => Branch, (branch) => branch.deprecate, {
    onDelete: 'CASCADE',
  })
  branch: Branch;

  @ManyToOne(() => Product, (product) => product.deprecate, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.deprecate)
  sizeQuantity: SizeQuantity[];

  @Column({ type: 'date', default: () => 'NOW()' })
  date: Date;
}
