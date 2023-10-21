import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt-access'))
  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();
    return res.send(users);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const users = await this.usersService.findOne(+id);
    return res.send(users);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const users = await this.usersService.remove(+id);
    return res.send(users);
  }
}
