import { Test, TestingModule } from '@nestjs/testing';
import { DocumentApplicationsController } from './document-applications.controller';
import { DocumentApplicationsService } from './document-applications.service';

describe('DocumentApplicationsController', () => {
  let controller: DocumentApplicationsController;

  const mockDocumentApplicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadFile: jest.fn(),
    getFileDownloadUrl: jest.fn(),
    updateStatus: jest.fn(),
    getApplicationStats: jest.fn(),
    findByStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentApplicationsController],
      providers: [
        {
          provide: DocumentApplicationsService,
          useValue: mockDocumentApplicationsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentApplicationsController>(
      DocumentApplicationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
