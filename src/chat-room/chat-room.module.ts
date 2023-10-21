import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomGateway } from './chat-room.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from 'src/messages/entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ChatRoomController } from './chat-room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message, User])],
  controllers: [ChatRoomController],
  providers: [ChatRoomGateway, ChatRoomService, UsersService],
})
export class ChatRoomModule {}
