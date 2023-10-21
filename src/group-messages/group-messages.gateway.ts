import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { GroupMessagesService } from './group-messages.service';
import { CreateMessageDto } from './dto/create-group-message.dto';
import { Server, Socket } from 'socket.io';
import { decode, verify } from 'jsonwebtoken';

@WebSocketGateway(8001, { cors: '*:*' })
export class GroupMessagesGateway {
  constructor(private readonly groupMessagesService: GroupMessagesService) {}

  @WebSocketServer()
  server: Server;

  private handleCheckToken(client: Socket) {
    try {
      verify(client.request.headers.authorization, 'access-token-secret');
    } catch (e) {
      console.error(e);
      client.disconnect();
    }
  }

  private getCurrentUser(client: Socket) {
    const decodedToken = decode(client.request.headers.authorization);
    return decodedToken;
  }

  handleConnection(client: Socket) {
    console.log(client.id);
    this.handleCheckToken(client);
  }

  @SubscribeMessage('createGroupMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    // this.handleCheckToken(client);
    const newMessage = await this.groupMessagesService.create(createMessageDto);
    this.server
      .to(createMessageDto.chatGroupId)
      .emit('createGroupMessage', newMessage);
  }

  @SubscribeMessage('joinToChatGroup')
  async JoinToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('title') chatRoomTitle: string,
  ) {
    client.join(chatRoomTitle);
    client.emit('joinToChatGroup', { title: chatRoomTitle });
  }

  @SubscribeMessage('typing')
  Typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const email = this.getCurrentUser(client)['email'];
    console.log('isTyping', isTyping);
    console.log('email', email);
    client.broadcast.emit('typing', { email, isTyping });
  }
}
