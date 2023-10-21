import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { GenderEnum } from '../types';

export class FindUserForSigninDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(18)
  password: string;
}
