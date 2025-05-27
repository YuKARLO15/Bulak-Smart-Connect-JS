import { PartialType } from '@nestjs/swagger';
import { CreateDocumentApplicationDto } from './create-document-application.dto';

export class UpdateDocumentApplicationDto extends PartialType(CreateDocumentApplicationDto) {}
