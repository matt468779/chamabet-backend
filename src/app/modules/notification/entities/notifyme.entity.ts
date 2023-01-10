import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Branch } from '../../branch/entities/branch.entity';
import { Product } from '../../product/entities/product.entity';
import { SizeQuantity } from '../../stock/entities/sizeQuantity.entity';

@Unique(['branch', 'product'])
@Entity()
export class NotifyMe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.sale, { onDelete: 'CASCADE' })
  branch: Branch;

  @ManyToOne(() => Product, (product) => product.sale, { onDelete: 'CASCADE' })
  product: Product;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.notifyme)
  sizeQuantity: SizeQuantity[];
}
 