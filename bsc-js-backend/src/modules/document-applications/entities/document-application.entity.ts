import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { DocumentFile } from './document-file.entity';
import { ApplicationStatusHistory } from './application-status-history.entity';

export enum ApplicationType {
  BIRTH_CERTIFICATE = 'Birth Certificate',
  MARRIAGE_CERTIFICATE = 'Marriage Certificate',
  MARRIAGE_LICENSE = 'Marriage License',
  DEATH_CERTIFICATE = 'Death Certificate',
  BUSINESS_PERMIT = 'Business Permit',
}

export enum ApplicationStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  READY_FOR_PICKUP = 'Ready for Pickup',
}

@Entity('document_applications')
@Index(['userId'])
@Index(['applicationType'])
@Index(['status'])
@Index(['createdAt'])
export class DocumentApplication {
  @PrimaryColumn({ length: 50 })
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({
    type: 'enum',
    enum: ApplicationType,
    name: 'application_type',
  })
  applicationType: ApplicationType;

  @Column({ name: 'application_subtype', length: 100, nullable: true })
  applicationSubtype: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ name: 'status_message', type: 'text', nullable: true })
  statusMessage: string;

  @Column({ name: 'form_data', type: 'json' })
  formData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_modified_by', nullable: true })
  lastModifiedBy: number;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DocumentFile, (file) => file.application, { cascade: true })
  files: DocumentFile[];

  @OneToMany(() => ApplicationStatusHistory, (history) => history.application, {
    cascade: true,
  })
  statusHistory: ApplicationStatusHistory[];
}
