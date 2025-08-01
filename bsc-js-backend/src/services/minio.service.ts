import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor() {
    const enablePort = process.env.MINIO_ENABLE_PORT !== 'false'; // Default to true for backward compatibility

    const minioConfig: {
      endPoint: string;
      useSSL: boolean;
      accessKey: string;
      secretKey: string;
      region: string;
      pathStyle: boolean;
      port?: number;
    } = {
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
      region: 'auto', // R2 uses 'auto' region
      pathStyle: true, // Required for R2 compatibility
    };

    // Conditionally include port for R2 compatibility
    if (enablePort) {
      minioConfig.port = parseInt(process.env.MINIO_PORT || '9000');
    }

    this.minioClient = new Minio.Client(minioConfig);

    this.bucketName = process.env.MINIO_BUCKET_NAME || 'bulak-smart-connect';
  }

  async uploadFile(
    file: Express.Multer.File,
    objectName: string,
  ): Promise<string> {
    try {
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'Original-Name': file.originalname,
        },
      );

      this.logger.log(`File uploaded: ${objectName}`);
      return objectName;
    } catch (error) {
      this.logger.error('Upload failed:', error);
      throw error;
    }
  }

  async getDownloadUrl(objectName: string): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        objectName,
        3600,
      );
    } catch (error) {
      this.logger.error('Get URL failed:', error);
      throw error;
    }
  }

  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
      this.logger.log(`File deleted: ${objectName}`);
    } catch (error) {
      this.logger.error('Delete failed:', error);
      throw error;
    }
  }
}
