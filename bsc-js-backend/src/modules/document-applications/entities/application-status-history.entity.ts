import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DocumentApplication } from './document-application.entity';

@Entity('application_status_history')
@Index(['applicationId'])
@Index(['changedAt'])
export class ApplicationStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'application_id', length: 50 })
  applicationId: string;

  @Column({ name: 'old_status', length: 50, nullable: true })
  oldStatus: string;

  @Column({ name: 'new_status', length: 50 })
  newStatus: string;

  @Column({ name: 'status_message', type: 'text', nullable: true })
  statusMessage: string;

  @Column({ name: 'changed_by', nullable: true })
  changedBy: number;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;

  // Relations
  @ManyToOne(() => DocumentApplication, (app) => app.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: DocumentApplication;
}