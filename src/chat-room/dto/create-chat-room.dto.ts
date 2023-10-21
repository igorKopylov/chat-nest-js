import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsNumber()
  recipientId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
