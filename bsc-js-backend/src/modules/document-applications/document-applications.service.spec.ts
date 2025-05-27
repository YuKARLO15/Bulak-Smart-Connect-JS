import { Test, TestingModule } from '@nestjs/testing';
import { DocumentApplicationsService } from './document-applications.service';

describe('DocumentApplicationsService', () => {
  let service: DocumentApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentApplicationsService],
    }).compile();

    service = module.get<DocumentApplicationsService>(DocumentApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
