import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Lookups {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  key: string;
  @Column()
  value: string;
  @Column({ default: 'color' })
  type: string;
} 
