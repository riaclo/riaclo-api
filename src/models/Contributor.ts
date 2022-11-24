import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';
import { Role } from './Role';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { ContributeType } from '../modules/contributor/dto/validation-contributor.dto';

@Entity('contributor')
export class Contributor extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  uuid!: string;

  @Column({ nullable: true })
  contributeType?: ContributeType;

  @Column({ type: 'bigint', nullable: true })
  contributeId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;
  @ManyToOne(() => Organization, (organization) => organization.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userCreatedId', referencedColumnName: 'id' }])
  userCreated?: User;

  @Column({ type: 'bigint', nullable: true })
  roleId?: number;
  @ManyToOne(() => Role, (role) => role.contributors)
  @JoinColumn()
  role?: Role;
}
