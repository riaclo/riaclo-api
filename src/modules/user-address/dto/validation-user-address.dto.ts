import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
} from 'class-validator';

export class CreateOrUpdateUserAddressDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  user_address_uuid: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  street1: string;

  @IsOptional()
  @IsString()
  street2: string;

  @IsOptional()
  @IsString()
  cap: string;

  @IsOptional()
  @IsInt()
  countryId: number;

  @IsOptional()
  user: User;
}
