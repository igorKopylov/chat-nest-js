import { Controller, Get, Res } from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';
import { Response } from 'express';

@Controller('chatGroups')
export class ChatGroupsController {
  constructor(private chatGroupsService: ChatGroupsService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const chatGroups = await this.chatGroupsService.findAll();
    return res.send(chatGroups);
  }
}
