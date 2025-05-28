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
