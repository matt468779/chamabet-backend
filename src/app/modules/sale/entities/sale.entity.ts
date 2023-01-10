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
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.sale, { onDelete: 'CASCADE' })
  branch: Branch;

  @ManyToOne(() => Product, (product) => product.sale, { onDelete: 'CASCADE' })
  product: Product;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.sale)
  sizeQuantity: SizeQuantity[];

  @Column({ type: 'date', default: () => 'NOW()' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  isDelivery: boolean;
}
