import { GroupMessage } from 'src/group-messages/entities/group-message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChatGroup extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.joinedChatGroups)
  creator: User;

  @ManyToMany(() => User, (user) => user.joinedChatGroups)
  @JoinTable()
  participants: User[];

  @OneToMany(() => GroupMessage, (groupMsg) => groupMsg.chatGroup, {
    cascade: ['insert', 'remove', 'update'],
  })
  messages: GroupMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
