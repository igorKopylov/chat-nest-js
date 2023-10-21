import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ChatGroupsService } from './chat-groups.service';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';
import { Server, Socket } from 'socket.io';
import { decode, verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { JoinToChatGroupDto } from './dto/join-to-chat-group.dto';

@WebSocketGateway(8001, { cors: '*:*' })
export class ChatGroupsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatGroupsService: ChatGroupsService,
    private readonly usersService: UsersService,
  ) {}

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
    console.log('socket data', client.id);
    this.handleCheckToken(client);
    this.connectToChatGroups(client);
  }

  @SubscribeMessage('createChatGroup')
  async create(
    @MessageBody() createChatGroupDto: CreateChatGroupDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { sub: userId } = this.getCurrentUser(client);
    const user = await this.usersService.findOneById(+userId);
    client.join(createChatGroupDto.title);

    const newChatGroup = await this.chatGroupsService.create(
      createChatGroupDto,
      user,
    );
    this.server.emit('createChatGroup', newChatGroup);
  }

  private async connectToChatGroups(client: Socket) {
    const { sub: userId } = this.getCurrentUser(client);

    const user = await this.usersService.findOneById(+userId);
    user.joinedChatGroups.forEach((obj) => {
      client.join(obj.title);
    });
  }

  @SubscribeMessage('findAllChatGroups')
  async findAll() {
    const chatGroups = await this.chatGroupsService.findAll();
    this.server.emit('findAllChatGroups', chatGroups);
  }

  @SubscribeMessage('findAllChatGroups')
  async createChatGroup() {
    await this.chatGroupsService.findAll();
  }

  @SubscribeMessage('findOneChatGroup')
  findOne(@MessageBody() id: string) {
    return this.chatGroupsService.findOneById(id);
  }

  @SubscribeMessage('joinToChatGroup')
  async update(
    @MessageBody() joinToChatGroupDto: JoinToChatGroupDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { sub: userId } = this.getCurrentUser(client);
    const user = await this.usersService.findOneById(+userId);

    await this.chatGroupsService.join(joinToChatGroupDto, user);

    this.server.emit('joinToChatGroup', {
      message: 'chatGroup successfully joined!',
    });
  }

  @SubscribeMessage('removeChatGroup')
  remove(@MessageBody() id: number) {
    return this.chatGroupsService.remove(id);
  }
}
