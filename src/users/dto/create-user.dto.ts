import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { GenderEnum } from '../types';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(18)
  password: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;
}
