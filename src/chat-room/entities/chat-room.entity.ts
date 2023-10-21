import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.chatRooms)
  recipient: User;

  @ManyToOne(() => User, (user) => user.chatRooms)
  creator: User;

  @OneToMany(() => Message, (msg) => msg.chatRoom, {
    cascade: ['insert', 'remove', 'update'],
  })
  messages: Message[];

  //   @Column()
  //   lastMessageSent: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
