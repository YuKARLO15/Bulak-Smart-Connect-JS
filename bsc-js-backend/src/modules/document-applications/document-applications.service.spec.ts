import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentApplicationsService } from './document-applications.service';
import { DocumentApplication } from './entities/document-application.entity';
import { DocumentFile } from './entities/document-file.entity';
import { ApplicationStatusHistory } from './entities/application-status-history.entity';
import { MinioService } from './services/minio.service';

describe('DocumentApplicationsService', () => {
  let service: DocumentApplicationsService;

  const mockDocumentApplicationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  };

  const mockDocumentFileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockApplicationStatusHistoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockMinioService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    getFileDownloadUrl: jest.fn(),
    listFiles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentApplicationsService,
        {
          provide: getRepositoryToken(DocumentApplication),
          useValue: mockDocumentApplicationRepository,
        },
        {
          provide: getRepositoryToken(DocumentFile),
          useValue: mockDocumentFileRepository,
        },
        {
          provide: getRepositoryToken(ApplicationStatusHistory),
          useValue: mockApplicationStatusHistoryRepository,
        },
        {
          provide: MinioService,
          useValue: mockMinioService,
        },
      ],
    }).compile();

    service = module.get<DocumentApplicationsService>(
      DocumentApplicationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
