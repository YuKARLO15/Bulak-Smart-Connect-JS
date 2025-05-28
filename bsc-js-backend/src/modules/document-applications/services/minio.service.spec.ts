/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MinioService } from './minio.service';

describe('MinioService (Document Applications)', () => {
  let service: MinioService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        MINIO_ENDPOINT: 'localhost',
        MINIO_PORT: 9000,
        MINIO_USE_SSL: 'false',
        MINIO_ACCESS_KEY: 'minioadmin',
        MINIO_SECRET_KEY: 'minioadmin123',
        MINIO_BUCKET_NAME: 'document-applications',
      };
      return config[key] || defaultValue;
    }),
  };

  // Mock the MinIO client methods
  const mockMinioClient = {
    putObject: jest.fn(),
    presignedGetObject: jest.fn(),
    removeObject: jest.fn(),
    bucketExists: jest.fn(),
    makeBucket: jest.fn(),
    listBuckets: jest.fn(),
    statObject: jest.fn(),
    listObjects: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MinioService>(MinioService);
    
    // Mock the internal minio client
    (service as any).minioClient = mockMinioClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should ensure bucket exists on initialization', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(true);

      await service.onModuleInit();

      expect(mockMinioClient.bucketExists).toHaveBeenCalledWith('document-applications');
    });

    it('should create bucket if it does not exist', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(false);
      mockMinioClient.makeBucket.mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(mockMinioClient.bucketExists).toHaveBeenCalledWith('document-applications');
      expect(mockMinioClient.makeBucket).toHaveBeenCalledWith('document-applications', 'us-east-1');
    });
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test content'),
        size: 12,
        mimetype: 'application/pdf',
        originalname: 'document.pdf',
      } as Express.Multer.File;

      mockMinioClient.putObject.mockResolvedValue(undefined);

      const result = await service.uploadFile(mockFile, 'documents/test.pdf');

      expect(result).toBe('documents/test.pdf');
      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'document-applications',
        'documents/test.pdf',
        mockFile.buffer,
        mockFile.size,
        expect.objectContaining({
          'Content-Type': 'application/pdf',
          'Original-Name': 'document.pdf',
          'Upload-Date': expect.any(String),
          'File-Size': '12',
        }),
      );
    });
  });

  describe('getPresignedUrl', () => {
    it('should generate a presigned URL with default expiry', async () => {
      const expectedUrl = 'https://minio.example.com/presigned-url';
      mockMinioClient.presignedGetObject.mockResolvedValue(expectedUrl);

      const result = await service.getPresignedUrl('documents/test.pdf');

      expect(result).toBe(expectedUrl);
      expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith(
        'document-applications',
        'documents/test.pdf',
        3600,
      );
    });

    it('should generate a presigned URL with custom expiry', async () => {
      const expectedUrl = 'https://minio.example.com/presigned-url';
      mockMinioClient.presignedGetObject.mockResolvedValue(expectedUrl);

      const result = await service.getPresignedUrl('documents/test.pdf', 7200);

      expect(result).toBe(expectedUrl);
      expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith(
        'document-applications',
        'documents/test.pdf',
        7200,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      mockMinioClient.removeObject.mockResolvedValue(undefined);

      await service.deleteFile('documents/test.pdf');

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith(
        'document-applications',
        'documents/test.pdf',
      );
    });
  });

  describe('getFileInfo', () => {
    it('should get file information', async () => {
      const expectedInfo = {
        size: 1024,
        lastModified: new Date(),
        metaData: {},
      };
      mockMinioClient.statObject.mockResolvedValue(expectedInfo);

      const result = await service.getFileInfo('documents/test.pdf');

      expect(result).toBe(expectedInfo);
      expect(mockMinioClient.statObject).toHaveBeenCalledWith(
        'document-applications',
        'documents/test.pdf',
      );
    });
  });

  describe('listFiles', () => {
    it('should list files without prefix', async () => {
      const mockStream = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback({ name: 'file1.pdf' });
            callback({ name: 'file2.pdf' });
          } else if (event === 'end') {
            setTimeout(callback, 0);
          }
          return mockStream;
        }),
      };

      mockMinioClient.listObjects.mockReturnValue(mockStream);

      const result = await service.listFiles();

      expect(result).toEqual([{ name: 'file1.pdf' }, { name: 'file2.pdf' }]);
      expect(mockMinioClient.listObjects).toHaveBeenCalledWith(
        'document-applications',
        undefined,
        true,
      );
    });

    it('should list files with prefix', async () => {
      const mockStream = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback({ name: 'documents/file1.pdf' });
          } else if (event === 'end') {
            setTimeout(callback, 0);
          }
          return mockStream;
        }),
      };

      mockMinioClient.listObjects.mockReturnValue(mockStream);

      const result = await service.listFiles('documents/');

      expect(result).toEqual([{ name: 'documents/file1.pdf' }]);
      expect(mockMinioClient.listObjects).toHaveBeenCalledWith(
        'document-applications',
        'documents/',
        true,
      );
    });
  });
});