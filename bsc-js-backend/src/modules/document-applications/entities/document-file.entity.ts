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

@Entity('document_files')
@Index(['applicationId'])
@Index(['documentCategory'])
export class DocumentFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'application_id', length: 50 })
  applicationId: string;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_type', length: 100 })
  fileType: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ name: 'minio_object_name', length: 500 })
  minioObjectName: string;

  @Column({ name: 'document_category', length: 100, nullable: true })
  documentCategory: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  // Relations
  @ManyToOne(() => DocumentApplication, (app) => app.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: DocumentApplication;
}
