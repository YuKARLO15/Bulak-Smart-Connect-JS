import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>(
      'MINIO_ENDPOINT',
      'localhost',
    );
    const port = this.configService.get<number>('MINIO_PORT', 9000);
    const useSSLValue = this.configService
      .get<string>('MINIO_USE_SSL', 'false')
      .toLowerCase();
    const useSSL = ['true', '1', 'yes', 'on'].includes(useSSLValue);
    const accessKey = this.configService.get<string>(
      'MINIO_ACCESS_KEY',
      'minioadmin',
    );
    const secretKey = this.configService.get<string>(
      'MINIO_SECRET_KEY',
      'minioadmin123',
    );

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });

    this.bucketName = this.configService.get<string>(
      'MINIO_BUCKET_NAME',
      'bulak-smart-connect',
    );

    this.logger.log(`MinIO configured with endpoint: ${endpoint}:${port}`);
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket ${this.bucketName} created successfully`);
      } else {
        this.logger.log(`Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      this.logger.error('Error ensuring bucket exists:', error);
      throw error;
    }
  }

  private sanitizeObjectName(objectName: string): string {
    return objectName
      .replace(/\//g, '-')           // Replace forward slashes with hyphens
      .replace(/\\/g, '-')           // Replace backslashes with hyphens
      .replace(/[<>:"|?*]/g, '')     // Remove other problematic characters
      .replace(/\s+/g, '_')          // Replace spaces with underscores
      .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
      .trim();
  }

  async uploadFile(
    file: Express.Multer.File,
    objectName: string,
  ): Promise<string> {
    try {
      // Sanitize the object name to prevent path issues
      const sanitizedObjectName = this.sanitizeObjectName(objectName);
      
      const metaData = {
        'Content-Type': file.mimetype,
        'Original-Name': file.originalname,
        'Upload-Date': new Date().toISOString(),
        'File-Size': file.size.toString(),
        'Original-Object-Name': objectName, // Store original name for reference
      };

      await this.minioClient.putObject(
        this.bucketName,
        sanitizedObjectName,
        file.buffer,
        file.size,
        metaData,
      );

      this.logger.log(`File uploaded successfully: ${sanitizedObjectName}`);
      this.logger.log(`Original object name: ${objectName}`);
      
      return sanitizedObjectName;
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      this.logger.error(`Failed object name: ${objectName}`);
      throw error;
    }
  }

  async getPresignedUrl(
    objectName: string,
    expiry: number = 3600,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        objectName,
        expiry,
      );
    } catch (error) {
      this.logger.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
      this.logger.log(`File deleted successfully: ${objectName}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileInfo(objectName: string): Promise<any> {
    try {
      return await this.minioClient.statObject(this.bucketName, objectName);
    } catch (error) {
      this.logger.error('Error getting file info:', error);
      throw error;
    }
  }

  async listFiles(prefix?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const files: any[] = [];
      const stream = this.minioClient.listObjects(
        this.bucketName,
        prefix,
        true,
      );

      stream.on('data', (obj) => files.push(obj));
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  }
}
