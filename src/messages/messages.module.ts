import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { UsersService } from 'src/users/users.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';
import { MessagesController } from './messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, ChatRoom])],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService, UsersService, ChatRoomService],
})
export class MessagesModule {}
