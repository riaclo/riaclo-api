import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../infrastructure/databases/common/BaseDeleteEntity';
import { Color } from '../infrastructure/utils/commons/get-colors';
import { AmountUsage } from './AmountUsage';
import { Contributor } from './Contributor';
import { AmountBalance } from './AmountBalance';
import { UserAddress } from './UserAddress';

@Entity('organization')
export class Organization extends BaseDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'uuid', unique: true })
  uuid!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: false })
  requiresPayment?: boolean;

  @Column({ nullable: true })
  color?: Color;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @OneToMany(() => Contributor, (contributor) => contributor.organization, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => AmountUsage, (amountUsage) => amountUsage.organization, {
    onDelete: 'CASCADE',
  })
  amountUsages?: AmountUsage[];

  @OneToMany(() => AmountBalance, (amountBalance) => amountBalance.organization)
  amountBalances?: AmountBalance[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.organization)
  userAddress?: UserAddress[];

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => User, (user) => user.organizationInUtilization, {
    onDelete: 'CASCADE',
  })
  users?: User[];
}
