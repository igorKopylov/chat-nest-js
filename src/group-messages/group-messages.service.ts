import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-group-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMessage } from './entities/group-message.entity';
import { Repository } from 'typeorm';
import { ChatGroup } from 'src/chat-groups/entities/chat-group.entity';
import { ChatGroupsService } from 'src/chat-groups/chat-groups.service';

@Injectable()
export class GroupMessagesService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly msgRepo: Repository<GroupMessage>,
    @InjectRepository(ChatGroup)
    private readonly chatGroupService: ChatGroupsService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const chatGroup = await this.chatGroupService.findOneById(
      createMessageDto.chatGroupId,
    );
    const newMessage = this.msgRepo.create({
      text: createMessageDto.text,
      chatGroup,
    });
    console.log(chatGroup, newMessage);
    const savedMessage = await this.msgRepo.save(newMessage);
    return savedMessage;
  }

  async findAll() {
    const messages = await this.msgRepo.find();
    return messages;
  }
}
