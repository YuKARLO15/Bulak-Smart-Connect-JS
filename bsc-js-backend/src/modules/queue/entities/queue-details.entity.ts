import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Queue } from './queue.entity';
import { User } from '../../../users/entities/user.entity';

@Entity('queue_details')
export class QueueDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'queue_id' })
  queueId: number;

  @ManyToOne(() => Queue, queue => queue.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'queue_id', foreignKeyConstraintName: 'fk_queue_id' })
  queue: Queue;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_user_id' })
  user: User;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'middle_initial', nullable: true })
  middleInitial: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'reason_of_visit' })
  reasonOfVisit: string;

  @Column({ name: 'appointment_type' })
  appointmentType: string;
}