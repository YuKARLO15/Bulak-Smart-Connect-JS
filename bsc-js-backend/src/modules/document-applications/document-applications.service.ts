import { Injectable } from '@nestjs/common';
import { CreateDocumentApplicationDto } from './dto/create-document-application.dto';
import { UpdateDocumentApplicationDto } from './dto/update-document-application.dto';

@Injectable()
export class DocumentApplicationsService {
  create(createDocumentApplicationDto: CreateDocumentApplicationDto) {
    return 'This action adds a new documentApplication';
  }

  findAll() {
    return `This action returns all documentApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentApplication`;
  }

  update(id: number, updateDocumentApplicationDto: UpdateDocumentApplicationDto) {
    return `This action updates a #${id} documentApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentApplication`;
  }
}
