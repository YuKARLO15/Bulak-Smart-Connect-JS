import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, OneToOne } from 'typeorm';
import { QueueDetails } from './queue-details.entity';
import { Counter } from '../../counter/entities/counter.entity';

export enum QueueStatus {
  PENDING = 'pending',
  SERVING = 'serving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'queue_number', unique: true })
  queueNumber: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.PENDING
  })
  status: QueueStatus;

  @Column({ name: 'counter_number', nullable: true })
  counterNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @Column({ name: 'estimated_wait_time', nullable: true })
  estimatedWaitTime: number;

  @OneToMany(() => QueueDetails, details => details.queue)
  details: QueueDetails[];

  @OneToOne(() => Counter, counter => counter.currentQueue, { nullable: true })
  counter: Counter;
}