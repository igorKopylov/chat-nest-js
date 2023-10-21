import { ChatGroup } from 'src/chat-groups/entities/chat-group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => ChatGroup, (chatGroup) => chatGroup.messages)
  chatGroup: ChatGroup;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  text: string;
}
