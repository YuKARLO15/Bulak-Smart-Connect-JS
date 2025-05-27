import { Test, TestingModule } from '@nestjs/testing';
import { DocumentApplicationsController } from './document-applications.controller';
import { DocumentApplicationsService } from './document-applications.service';

describe('DocumentApplicationsController', () => {
  let controller: DocumentApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentApplicationsController],
      providers: [DocumentApplicationsService],
    }).compile();

    controller = module.get<DocumentApplicationsController>(DocumentApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
