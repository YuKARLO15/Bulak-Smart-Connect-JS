import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Queue } from '../../queue/entities/queue.entity';

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
    default: CounterStatus.ACTIVE,
  })
  status: CounterStatus;

  @Column({ name: 'current_queue_id', nullable: true })
  currentQueueId: number | null;

  @OneToOne(() => Queue, (queue) => queue.counter, { nullable: true })
  @JoinColumn({
    name: 'current_queue_id',
    foreignKeyConstraintName: 'fk_current_queue',
  })
  currentQueue: Queue | null;
}
