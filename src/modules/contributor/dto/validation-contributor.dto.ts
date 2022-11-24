import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsIn,
} from 'class-validator';

export type RoleName = 'ADMIN' | 'MODERATOR';

export const getOneRoleByNumber = (state: number): RoleName => {
  switch (state) {
    case 1:
      return 'ADMIN';
    case 2:
      return 'MODERATOR';
    default:
      return 'ADMIN';
  }
};

export const getOneRoleByName = (state: RoleName): number => {
  switch (state) {
    case 'ADMIN':
      return 1;
    case 'MODERATOR':
      return 2;
    default:
      return 1;
  }
};

export type ContributeType = 'ORGANIZATION';
export const contributeTypeArrays = ['ORGANIZATION'];

export class CreateOrUpdateContributorDto {
  @IsOptional()
  @IsString()
  subscribableType: ContributeType;
}

export class UpdateOnRoleContributorDto {
  @IsNotEmpty()
  @IsInt()
  roleId: number;

  @IsNotEmpty()
  @IsString()
  contributor_uuid: string;

  @IsOptional()
  @IsInt()
  contributorId: number;
}

export class contributorRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(contributeTypeArrays)
  type: ContributeType;

  @IsOptional()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  organizationId: number;

  @IsOptional()
  @IsInt()
  contributorId?: number;

  @IsOptional()
  @IsBoolean()
  is_paginate?: boolean;
}
