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
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.source, { onDelete: 'CASCADE' })
  source: Branch;

  @ManyToOne(() => Branch, (branch) => branch.destination, {
    onDelete: 'CASCADE',
  })
  destination: Branch;

  @ManyToOne(() => Product, (product) => product.assignment, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => SizeQuantity, (sizeQuantity) => sizeQuantity.assignment)
  sizeQuantity: SizeQuantity[];

  @Column({ type: 'date', default: () => 'NOW()' })
  date: string;
}
