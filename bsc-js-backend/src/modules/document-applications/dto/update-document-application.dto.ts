import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentApplicationDto } from './create-document-application.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../entities/document-application.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentApplicationDto extends PartialType(CreateDocumentApplicationDto) {
  @ApiProperty({
    enum: ApplicationStatus,
    description: 'Application status',
    example: ApplicationStatus.APPROVED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({
    description: 'Status message',
    example: 'Application approved and ready for pickup',
    required: false,
  })
  @IsOptional()
  @IsString()
  statusMessage?: string;
}
