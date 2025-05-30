import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentApplicationsService } from './document-applications.service';
import { DocumentApplicationsController } from './document-applications.controller';
import { DocumentApplication } from './entities/document-application.entity';
import { DocumentFile } from './entities/document-file.entity';
import { ApplicationStatusHistory } from './entities/application-status-history.entity';
import { MinioService } from './services/minio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentApplication,
      DocumentFile,
      ApplicationStatusHistory,
    ]),
  ],
  controllers: [DocumentApplicationsController],
  providers: [DocumentApplicationsService, MinioService],
  exports: [DocumentApplicationsService, MinioService],
})
export class DocumentApplicationsModule {}
