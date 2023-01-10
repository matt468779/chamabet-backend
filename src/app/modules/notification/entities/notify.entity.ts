import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';
@Unique(['branch', 'product'])

@Entity()
export class Notify {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.notify, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Branch, (branch) => branch.notify, {
    onDelete: 'CASCADE',
  })
  branch: Branch;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.notify)
  sizeQuantity: SizeQuantity[];
}
