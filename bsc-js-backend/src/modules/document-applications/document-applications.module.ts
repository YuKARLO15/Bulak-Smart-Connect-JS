import { Module } from '@nestjs/common';
import { DocumentApplicationsService } from './document-applications.service';
import { DocumentApplicationsController } from './document-applications.controller';

@Module({
  controllers: [DocumentApplicationsController],
  providers: [DocumentApplicationsService],
})
export class DocumentApplicationsModule {}
