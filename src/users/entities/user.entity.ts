import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { GenderEnum } from '../types';
import { ChatGroup } from 'src/chat-groups/entities/chat-group.entity';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';
import { Optional } from '@nestjs/common';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  @Optional()
  password: string;

  @Column({ nullable: true })
  gender: GenderEnum;

  @Column('simple-array')
  photos: string[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.creator)
  chatRooms: ChatRoom[];

  @ManyToMany(() => ChatGroup, (chatGroup) => chatGroup.participants)
  joinedChatGroups: ChatGroup[];
}
