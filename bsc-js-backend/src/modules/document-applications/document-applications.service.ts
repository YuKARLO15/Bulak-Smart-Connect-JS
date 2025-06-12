import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DocumentApplication,
  ApplicationStatus,
  ApplicationType,
} from './entities/document-application.entity';
import { DocumentFile } from './entities/document-file.entity';
import { ApplicationStatusHistory } from './entities/application-status-history.entity';
import { MinioService } from './services/minio.service';
import { CreateDocumentApplicationDto } from './dto/create-document-application.dto';
import { UpdateDocumentApplicationDto } from './dto/update-document-application.dto';

@Injectable()
export class DocumentApplicationsService {
  constructor(
    @InjectRepository(DocumentApplication)
    private documentApplicationRepository: Repository<DocumentApplication>,
    @InjectRepository(DocumentFile)
    private documentFileRepository: Repository<DocumentFile>,
    @InjectRepository(ApplicationStatusHistory)
    private statusHistoryRepository: Repository<ApplicationStatusHistory>,
    private minioService: MinioService,
  ) {}

  async create(
    createDto: CreateDocumentApplicationDto,
    userId?: number,
  ): Promise<DocumentApplication> {
    // Generate application ID
    const timestamp = Date.now().toString().slice(-6);
    const prefix = this.getApplicationPrefix(createDto.applicationType);
    const applicationId = `${prefix}-${timestamp}`;

    const application = this.documentApplicationRepository.create({
      id: applicationId,
      userId,
      status: ApplicationStatus.PENDING,
      statusMessage: 'Application submitted successfully',
      ...createDto,
    });

    return await this.documentApplicationRepository.save(application);
  }

  async findAll(userId?: number): Promise<DocumentApplication[]> {
    const query = this.documentApplicationRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.files', 'files')
      .orderBy('app.createdAt', 'DESC');

    if (userId) {
      query.where('app.userId = :userId', { userId });
    }

    return await query.getMany();
  }

  async findOne(id: string, userId?: number): Promise<DocumentApplication> {
    const query = this.documentApplicationRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.files', 'files')
      .leftJoinAndSelect('app.statusHistory', 'history')
      .where('app.id = :id', { id });

    if (userId) {
      query.andWhere('app.userId = :userId', { userId });
    }

    const application = await query.getOne();

    if (!application) {
      throw new NotFoundException(
        `Document application with ID ${id} not found`,
      );
    }

    return application;
  }

  async update(
    id: string,
    updateDto: UpdateDocumentApplicationDto,
    userId?: number,
    adminId?: number,
  ): Promise<DocumentApplication> {
    const application = await this.findOne(id, userId);

    // Track status changes
    if (updateDto.status && updateDto.status !== application.status) {
      await this.statusHistoryRepository.save({
        applicationId: id,
        oldStatus: application.status,
        newStatus: updateDto.status,
        statusMessage: updateDto.statusMessage,
        changedBy: adminId || userId,
      });
    }

    Object.assign(application, updateDto);
    if (adminId) {
      application.lastModifiedBy = adminId;
    }

    return await this.documentApplicationRepository.save(application);
  }

  async uploadFile(
    applicationId: string,
    file: Express.Multer.File,
    documentCategory: string,
    userId?: number,
  ): Promise<DocumentFile> {
    // Verify application exists and user has access
    await this.findOne(applicationId, userId);

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // File type validation
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and PDF files are allowed',
      );
    }

    // Generate unique object name
    const timestamp = Date.now();
    const objectName = `applications/${applicationId}/${documentCategory}/${timestamp}_${file.originalname}`;

    // Upload to MinIO
    await this.minioService.uploadFile(file, objectName);

    // Save file record
    const documentFile = this.documentFileRepository.create({
      applicationId,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      minioObjectName: objectName,
      documentCategory,
    });

    return await this.documentFileRepository.save(documentFile);
  }

  async getFileDownloadUrl(fileId: number, userId?: number): Promise<string> {
    const file = await this.documentFileRepository.findOne({
      where: { id: fileId },
      relations: ['application'],
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    // Check user access
    if (userId && file.application.userId !== userId) {
      throw new BadRequestException('Access denied to this file');
    }

    return await this.minioService.getPresignedUrl(file.minioObjectName);
  }

  async remove(id: string, userId?: number): Promise<void> {
    const application = await this.findOne(id, userId);

    // Delete files from MinIO
    for (const file of application.files) {
      try {
        await this.minioService.deleteFile(file.minioObjectName);
      } catch (error) {
        console.warn(`Failed to delete file ${file.minioObjectName}:`, error);
      }
    }

    await this.documentApplicationRepository.remove(application);
  }

  private getApplicationPrefix(type: ApplicationType): string {
    switch (type) {
      case ApplicationType.BIRTH_CERTIFICATE:
        return 'BC';
      case ApplicationType.MARRIAGE_CERTIFICATE:
        return 'MC';
      case ApplicationType.MARRIAGE_LICENSE:
        return 'ML';
      case ApplicationType.DEATH_CERTIFICATE:
        return 'DC';
      case ApplicationType.BUSINESS_PERMIT:
        return 'BP';
      default:
        return 'APP';
    }
  }

  // Admin methods
  async updateStatus(
    id: string,
    status: ApplicationStatus,
    statusMessage?: string,
    adminId?: number,
  ): Promise<DocumentApplication> {
    return await this.update(id, { status, statusMessage }, undefined, adminId);
  }

  async findByStatus(
    status: ApplicationStatus,
  ): Promise<DocumentApplication[]> {
    return await this.documentApplicationRepository.find({
      where: { status },
      relations: ['files', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getApplicationStats(): Promise<
    Array<{ type: string; status: string; count: string }>
  > {
    const stats = await this.documentApplicationRepository
      .createQueryBuilder('app')
      .select('app.applicationType', 'type')
      .addSelect('app.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('app.applicationType')
      .addGroupBy('app.status')
      .getRawMany();

    return stats as Array<{ type: string; status: string; count: string }>;
  }

  async getApplicationFiles(applicationId: string, userId?: number) {
    try {
      console.log(
        `Service: Getting files for application ${applicationId}, userId: ${userId}`,
      );

      // First verify the application exists and user has access
      const application = await this.documentApplicationRepository.findOne({
        where: {
          id: applicationId,
          ...(userId && { userId }), // Only filter by userId if provided (admin won't have this filter)
        },
        relations: {
          files: true, // Include related files
        },
      });

      if (!application) {
        throw new NotFoundException(`Application ${applicationId} not found`);
      }

      console.log(
        `Service: Found application with ${application.files?.length || 0} files`,
      );

      if (!application.files || application.files.length === 0) {
        console.log('Service: No files found for this application');
        return [];
      }

      // Generate presigned URLs for each file
      const filesWithUrls = await Promise.all(
        application.files.map(async (file) => {
          try {
            const downloadUrl = await this.minioService.getPresignedUrl(
              file.minioObjectName,
            );
            console.log(`Service: Generated URL for file ${file.fileName}`);
            return {
              id: file.id,
              fileName: file.fileName,
              fileType: file.fileType,
              fileSize: file.fileSize,
              documentCategory: file.documentCategory,
              minioObjectName: file.minioObjectName,
              uploadedAt: file.uploadedAt,
              url: downloadUrl,
              downloadUrl: downloadUrl,
            };
          } catch (error) {
            console.warn(`Service: Failed to generate URL for file ${file.id}:`, error);
            return {
              id: file.id,
              fileName: file.fileName,
              fileType: file.fileType,
              fileSize: file.fileSize,
              documentCategory: file.documentCategory,
              minioObjectName: file.minioObjectName,
              uploadedAt: file.uploadedAt,
              url: null,
              downloadUrl: null,
            };
          }
        }),
      );

      console.log(`Service: Returning ${filesWithUrls.length} files with URLs`);
      return filesWithUrls;
    } catch (error) {
      console.error('Service: Error getting application files:', error);
      throw error;
    }
  }
}
