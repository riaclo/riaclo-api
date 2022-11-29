import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  MaxLength,
  IsEmail,
  IsOptional,
  IsEmpty,
} from 'class-validator';
export class CreateOrUpdateContactDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  isRed: boolean;

  @IsOptional()
  @IsInt()
  userCreatedId: number;

  @IsOptional()
  @IsInt()
  organizationId: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
