import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UsersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPass = await hash(createUserDto.password, 10);

    const newUser = this.UsersRepository.create({
      ...createUserDto,
      photos: [],
      password: hashedPass,
    });
    // const tokens = await getTokens(newUser.id, newUser.email);

    // newUser.accessToken = tokens.accessToken;

    const user = await this.UsersRepository.save(newUser);

    return user;
  }

  async findAll() {
    const users = await this.UsersRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.UsersRepository.findOne({
      where: { id },
      relations: ['joinedChatGroups'],
    });

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    return user;
  }

  async findOneById(id: number) {
    const user = await this.UsersRepository.findOne({
      where: { id },
      relations: ['joinedChatGroups', 'chatRooms'],
    });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.UsersRepository.findOne({
      where: { email },
      relations: ['joinedChatGroups', 'chatRooms'],
    });
    return user;
  }

  async findOneForSignIn(email: string) {
    const user = await this.UsersRepository.findOne({
      where: { email },
    });
    return user;
  }

  async createByGoogle(email: string, name: string) {
    const newUser = await this.UsersRepository.save({
      email,
      name,
      gneder: 'male',
    });
    return newUser;
  }

  // updateUserToken(userId: number, accessToken: any) {
  //   const user = this.UsersRepository.update(userId, { accessToken });
  //   return user;
  // }

  async remove(id: number) {
    const removedUser = await this.UsersRepository.delete({ id });
    return removedUser;
  }
}
