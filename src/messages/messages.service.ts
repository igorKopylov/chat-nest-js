import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private chatRoomService: ChatRoomService,
  ) {}

  async findAll(chatRoomId: string) {
    const messages = await this.messageRepo.find({
      where: { chatRoom: { id: chatRoomId } },
      order: { createdAt: 'DESC' },
      relations: ['chatRoom'],
    });
    return messages;
  }

  async create(createMessageDto: CreateMessageDto) {
    const { text, chatRoomId } = createMessageDto;
    const chatRoom = await this.chatRoomService.findOneById(chatRoomId);

    const newMessage = this.messageRepo.create({
      text,
      chatRoom,
    });

    const savedMessage = await this.messageRepo.save(newMessage);

    return savedMessage;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
