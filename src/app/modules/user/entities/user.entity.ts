import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Role } from '../../role/role.enum';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column({ default: ' ' })
  firstName: string;

  @Column({ default: ' ' })
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'boolean', default: false })
  isEmailConfirmed: boolean;

  @Column({ type: 'jsonb', nullable: true })
  address: string | string;
}
