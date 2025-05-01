import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Queue } from './queue.entity';

export enum CounterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('counters')
export class Counter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CounterStatus,
    default: CounterStatus.ACTIVE
  })
  status: CounterStatus;

  @Column({ name: 'current_queue_id', nullable: true })
  currentQueueId: number | null;

  @ManyToOne(() => Queue, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_queue_id' })
  currentQueue: Queue | null;
}