import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentApplicationsService } from './document-applications.service';
import { CreateDocumentApplicationDto } from './dto/create-document-application.dto';
import { UpdateDocumentApplicationDto } from './dto/update-document-application.dto';

@Controller('document-applications')
export class DocumentApplicationsController {
  constructor(private readonly documentApplicationsService: DocumentApplicationsService) {}

  @Post()
  create(@Body() createDocumentApplicationDto: CreateDocumentApplicationDto) {
    return this.documentApplicationsService.create(createDocumentApplicationDto);
  }

  @Get()
  findAll() {
    return this.documentApplicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentApplicationDto: UpdateDocumentApplicationDto) {
    return this.documentApplicationsService.update(+id, updateDocumentApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentApplicationsService.remove(+id);
  }
}
