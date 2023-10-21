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
import { Exclude } from 'class-transformer';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  gender: GenderEnum;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.creator)
  chatRooms: ChatRoom[];

  @ManyToMany(() => ChatGroup, (chatGroup) => chatGroup.participants)
  joinedChatGroups: ChatGroup[];
}
