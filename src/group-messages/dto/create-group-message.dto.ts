import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsUUID()
  chatGroupId: string;
}
