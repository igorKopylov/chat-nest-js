import { IsUUID } from 'class-validator';

export class JoinToChatGroupDto {
  @IsUUID()
  chatGroupId: string;
}
