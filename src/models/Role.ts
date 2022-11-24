import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';
import { Contributor } from './Contributor';

@Entity('role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Contributor, (contributor) => contributor.role)
  contributors?: Contributor[];
}
