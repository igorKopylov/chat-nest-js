import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt-access'))
@Controller('chatRooms')
export class ChatRoomController {
  constructor(
    private chatRoomService: ChatRoomService,
    private usersService: UsersService,
  ) {}

  @Get()
  async findUserRooms(@Req() req: Request, @Res() res: Response) {
    const chatRooms = await this.chatRoomService.findAll(req.user['id']);
    return res.send(chatRooms);
  }
}
