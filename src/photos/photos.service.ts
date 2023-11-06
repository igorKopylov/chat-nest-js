import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async setUserPhotos(userId: number, base64Strings: string[]) {
    const updatedUser = this.userRepo.update(userId, {
      photos: base64Strings,
    });
    return updatedUser;
  }

  async getUserPhotos(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('user not found');
    return user.photos;
  }
}
