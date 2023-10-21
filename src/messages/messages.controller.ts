import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@UseGuards(AuthGuard('jwt-access'))
@Controller('chatRooms/:roomId/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async findAllInChatRoom(
    @Res() res: Response,
    @Param('roomId') chatRoomId: string,
  ) {
    const messages = await this.messagesService.findAll(chatRoomId);
    return res.send(messages);
  }
}
