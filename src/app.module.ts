import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import TypeOrmModule from './db/typeorm.module';
import { GatewayModule } from './gateway.module';
import { GroupMessagesModule } from './group-messages/group-messages.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatGroupsModule } from './chat-groups/chat-groups.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    GatewayModule,
    GroupMessagesModule,
    UsersModule,
    AuthModule,
    UsersModule,
    ChatGroupsModule,
    ChatRoomModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
