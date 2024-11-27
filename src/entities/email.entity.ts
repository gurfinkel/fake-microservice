import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActionGeneratedByConnie } from './action-generated-by-connie.entity';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn({ name: 'email_id' })
  emailId: number;

  @Column({ name: 'action_id', type: 'integer' })
  actionId: number;

  @Column({ name: 'to_address', type: 'varchar', length: 255 })
  toAddress: string;

  @Column({ name: 'from_address', type: 'varchar', length: 255 })
  fromAddress: string;

  @Column({ name: 'subject', type: 'varchar', length: 255 })
  subject: string;

  @Column({ name: 'body', type: 'text' })
  body: string;

  @Column({
    name: 'date_created',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  dateCreated: Date;

  @Column({ name: 'date_sent', type: 'timestamp', nullable: true })
  dateSent: Date;

  @ManyToOne(() => ActionGeneratedByConnie)
  @JoinColumn({ name: 'action_id' })
  action: ActionGeneratedByConnie;
}
