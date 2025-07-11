/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from './minio.service';

describe('MinioService', () => {
  let service: MinioService;

  // Mock the MinIO client methods
  const mockMinioClient = {
    putObject: jest.fn(),
    presignedGetObject: jest.fn(),
    removeObject: jest.fn(),
    bucketExists: jest.fn(),
    makeBucket: jest.fn(),
    listBuckets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinioService],
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

  describe('MinIO client configuration with MINIO_ENABLE_PORT', () => {
    let originalEnv: NodeJS.ProcessEnv;
    let originalMinioClient: unknown;

    beforeEach(() => {
      originalEnv = process.env;
      originalMinioClient = require('minio').Client;
    });

    afterEach(() => {
      process.env = originalEnv;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('minio').Client = originalMinioClient;
    });

    it('should include port when MINIO_ENABLE_PORT is true', async () => {
      const mockMinioConstructor = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('minio').Client = mockMinioConstructor;

      process.env = {
        ...originalEnv,
        MINIO_ENDPOINT: 'localhost',
        MINIO_PORT: '9000',
        MINIO_USE_SSL: 'false',
        MINIO_ACCESS_KEY: 'minioadmin',
        MINIO_SECRET_KEY: 'minioadmin123',
        MINIO_ENABLE_PORT: 'true',
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [MinioService],
      }).compile();

      module.get<MinioService>(MinioService);

      expect(mockMinioConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          endPoint: 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: 'minioadmin',
          secretKey: 'minioadmin123',
          region: 'auto',
          pathStyle: true,
        }),
      );
    });

    it('should exclude port when MINIO_ENABLE_PORT is false', async () => {
      const mockMinioConstructor = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('minio').Client = mockMinioConstructor;

      process.env = {
        ...originalEnv,
        MINIO_ENDPOINT: 'r2.example.com',
        MINIO_PORT: '9000',
        MINIO_USE_SSL: 'true',
        MINIO_ACCESS_KEY: 'r2-access-key',
        MINIO_SECRET_KEY: 'r2-secret-key',
        MINIO_ENABLE_PORT: 'false',
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [MinioService],
      }).compile();

      module.get<MinioService>(MinioService);

      expect(mockMinioConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          endPoint: 'r2.example.com',
          useSSL: true,
          accessKey: 'r2-access-key',
          secretKey: 'r2-secret-key',
          region: 'auto',
          pathStyle: true,
        }),
      );

      // Ensure port is NOT included
      expect(mockMinioConstructor.mock.calls[0][0]).not.toHaveProperty('port');
    });

    it('should default to including port when MINIO_ENABLE_PORT is not set', async () => {
      const mockMinioConstructor = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('minio').Client = mockMinioConstructor;

      process.env = {
        ...originalEnv,
        MINIO_ENDPOINT: 'localhost',
        MINIO_PORT: '9000',
        MINIO_USE_SSL: 'false',
        MINIO_ACCESS_KEY: 'minioadmin',
        MINIO_SECRET_KEY: 'minioadmin123',
        // MINIO_ENABLE_PORT not set
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [MinioService],
      }).compile();

      module.get<MinioService>(MinioService);

      expect(mockMinioConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 9000,
        }),
      );
    });
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test content'),
        size: 12,
        mimetype: 'text/plain',
        originalname: 'test.txt',
      } as Express.Multer.File;

      mockMinioClient.putObject.mockResolvedValue(undefined);

      const result = await service.uploadFile(mockFile, 'test-object');

      expect(result).toBe('test-object');
      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        expect.any(String), // bucket name
        'test-object',
        mockFile.buffer,
        mockFile.size,
        expect.any(Object), // metadata
      );
    });
  });

  describe('getDownloadUrl', () => {
    it('should generate a presigned URL', async () => {
      const expectedUrl = 'https://minio.example.com/presigned-url';
      mockMinioClient.presignedGetObject.mockResolvedValue(expectedUrl);

      const result = await service.getDownloadUrl('test-object');

      expect(result).toBe(expectedUrl);
      expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith(
        expect.any(String), // bucket name
        'test-object',
        3600, // expiry
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      mockMinioClient.removeObject.mockResolvedValue(undefined);

      await service.deleteFile('test-object');

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith(
        expect.any(String), // bucket name
        'test-object',
      );
    });
  });
});
