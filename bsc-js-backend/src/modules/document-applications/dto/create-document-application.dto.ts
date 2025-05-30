import { IsEnum, IsOptional, IsObject, IsString } from 'class-validator';
import { ApplicationType } from '../entities/document-application.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentApplicationDto {
  @ApiProperty({
    enum: ApplicationType,
    description: 'Type of document application',
    example: ApplicationType.BIRTH_CERTIFICATE,
  })
  @IsEnum(ApplicationType)
  applicationType: ApplicationType;

  @ApiProperty({
    description: 'Application subtype (optional)',
    example: 'Copy of Birth Certificate',
    required: false,
  })
  @IsOptional()
  @IsString()
  applicationSubtype?: string;

  @ApiProperty({
    description: 'Form data containing all application details',
    example: {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      birthDate: '1990-01-01',
      birthPlace: 'Manila',
    },
  })
  @IsObject()
  formData: Record<string, any>;

  @ApiProperty({
    description: 'Optional status message',
    example: 'Initial application submission',
    required: false,
  })
  @IsOptional()
  @IsString()
  statusMessage?: string;
}
