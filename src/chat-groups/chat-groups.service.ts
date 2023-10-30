import { Injectable } from '@nestjs/common';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatGroup } from './entities/chat-group.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JoinToChatGroupDto } from './dto/join-to-chat-group.dto';

@Injectable()
export class ChatGroupsService {
  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatGroupRepo: Repository<ChatGroup>,
  ) {}

  async create(createChatGroupDto: CreateChatGroupDto, user: User) {
    const newChatGroup = await this.chatGroupRepo.save({
      ...createChatGroupDto,
    });

    if (user.joinedChatGroups) {
      user.joinedChatGroups = [newChatGroup, ...user.joinedChatGroups];
    }

    user.save();

    return newChatGroup;
  }

  async findAll() {
    const chatGroups = await this.chatGroupRepo.find({
      relations: ['messages'],
    });
    return chatGroups;
  }

  async findOneById(id: string) {
    const chatGroup = await this.chatGroupRepo.findOne({ where: { id } });
    return chatGroup;
  }

  async join(joinToChatGroupDto: JoinToChatGroupDto, user: User) {
    const joinedChatGroup = await this.chatGroupRepo.findOne({
      where: { id: joinToChatGroupDto.chatGroupId },
    });

    user.joinedChatGroups = [joinedChatGroup, ...user.joinedChatGroups];
    user.save();
  }

  remove(id: number) {
    return `This action removes a #${id} chatGroup`;
  }
}
