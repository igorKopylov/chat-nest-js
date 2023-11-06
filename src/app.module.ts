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
import { PhotosModule } from './photos/photos.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split('.').pop();
          cb(null, uniqueSuffix + '.' + extension);
        },
      }),
    }),
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
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
