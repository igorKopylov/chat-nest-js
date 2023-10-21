import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { Socket } from 'socket.io';
import { decode, verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(8001, { cors: '*:*' })
export class ChatRoomGateway {
  constructor(
    private chatRoomService: ChatRoomService,
    private usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Socket;

  private handleCheckToken(client: Socket) {
    try {
      verify(client.request.headers.authorization, 'access-token-secret');
    } catch (e) {
      console.error(e);
      client.disconnect();
    }
  }

  private async getCurrentUser(client: Socket) {
    const { sub: userId } = decode(client.request.headers.authorization);
    const user = await this.usersService.findOneById(+userId);
    return user;
  }

  private async connectToChatRooms(client: Socket) {
    const user = await this.getCurrentUser(client);

    user.chatRooms.forEach((obj) => {
      client.join(obj.id);
    });
  }

  handleConnection(client: Socket) {
    console.log('socket data', client.id);
    this.handleCheckToken(client);
    this.connectToChatRooms(client);
  }

  @SubscribeMessage('createChatRoom')
  async create(
    @MessageBody() createChatRoomDto: CreateChatRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('createChatRoom event');
    const creator = await this.getCurrentUser(client);
    const newChatRoom = await this.chatRoomService.create(
      createChatRoomDto,
      creator,
    );

    client.join(newChatRoom.chatRoom.id);
    this.server.emit('createChatRoom', newChatRoom);
  }

  @SubscribeMessage('updateChatRoom')
  update(@MessageBody() updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomService.update(updateChatRoomDto.id, updateChatRoomDto);
  }

  @SubscribeMessage('removeChatRoom')
  remove(@MessageBody() id: number) {
    return this.chatRoomService.remove(id);
  }
}
