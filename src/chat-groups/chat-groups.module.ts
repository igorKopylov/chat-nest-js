import { Module } from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGroupsGateway } from './chat-groups.gateway';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ChatGroup } from './entities/chat-group.entity';
import { ChatGroupsController } from './chat-group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatGroup])],
  controllers: [ChatGroupsController],
  providers: [ChatGroupsGateway, UsersService, ChatGroupsService],
})
export class ChatGroupsModule {}
