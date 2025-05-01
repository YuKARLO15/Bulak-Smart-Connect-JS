import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { QueueDetails } from './queue-details.entity';

export enum QueueStatus {
  PENDING = 'pending',
  SERVING = 'serving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'queue_number' })
  queueNumber: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.PENDING
  })
  status: QueueStatus;

  @Column({ nullable: true, name: 'counter_number' })
  counterNumber: string;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ name: 'estimated_wait_time', type: 'int', nullable: true })
  estimatedWaitTime: number;

  @OneToMany(() => QueueDetails, details => details.queue)
  details: QueueDetails[];
}