import { Module } from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { GroupMessagesGateway } from './group-messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './entities/group-message.entity';
import { ChatGroupsService } from 'src/chat-groups/chat-groups.service';
import { ChatGroup } from 'src/chat-groups/entities/chat-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMessage, ChatGroup])],
  providers: [GroupMessagesGateway, GroupMessagesService, ChatGroupsService],
})
export class GroupMessagesModule {}
