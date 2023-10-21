import { IsString } from 'class-validator';

export class CreateChatGroupDto {
  @IsString()
  title: string;
}
