import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    private usersService: UsersService,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto, creator: User) {
    const { recipientId, message } = createChatRoomDto;
    const recipient = await this.usersService.findOneById(recipientId);

    const newChatRoom = this.chatRoomRepo.create({
      recipient,
      creator,
    });

    const savedChatRoom = await this.chatRoomRepo.save(newChatRoom);

    const newMessage = await this.messagesRepo.save({
      text: message,
      chatRoom: savedChatRoom,
    });

    return { message: newMessage, chatRoom: savedChatRoom };
  }

  async findAll(userId: number) {
    const chatRooms = await this.chatRoomRepo
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.creator', 'creator')
      .leftJoinAndSelect('chatRoom.recipient', 'recipient')
      .leftJoinAndSelect('chatRoom.messages', 'messages')
      // .where('creator.id = :userId', { userId })
      // .orWhere('recipient.id = :userId', { userId })
      .getMany();

    return chatRooms;
  }

  async findOneById(id: string) {
    const chatRoom = await this.chatRoomRepo.findOne({
      where: { id },
      relations: ['messages, sender, recipient'],
    });

    return chatRoom;
  }

  update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    return `This action updates a #${id} chatRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatRoom`;
  }
}
