import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentApplicationsService } from './document-applications.service';
import { CreateDocumentApplicationDto } from './dto/create-document-application.dto';
import { UpdateDocumentApplicationDto } from './dto/update-document-application.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Document Applications')
@Controller('document-applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DocumentApplicationsController {
  constructor(private readonly documentApplicationsService: DocumentApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new document application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async create(@Body() createDto: CreateDocumentApplicationDto, @Request() req) {
    return this.documentApplicationsService.create(createDto, req.user.userId);
  }

  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        return callback(new BadRequestException('Only JPEG, PNG, and PDF files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload document file' })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentCategory') documentCategory: string,
    @Request() req,
  ) {
    return this.documentApplicationsService.uploadFile(
      id,
      file,
      documentCategory,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user applications' })
  async findAll(@Query('status') status?: string, @Request() req?) {
    const userId = req.user.roles.includes('admin') ? undefined : req.user.userId;
    return this.documentApplicationsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific application' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.roles.includes('admin') ? undefined : req.user.userId;
    return this.documentApplicationsService.findOne(id, userId);
  }

  @Get('files/:fileId/download')
  @ApiOperation({ summary: 'Get file download URL' })
  async getFileDownloadUrl(@Param('fileId') fileId: string, @Request() req) {
    const userId = req.user.roles.includes('admin') ? undefined : req.user.userId;
    const url = await this.documentApplicationsService.getFileDownloadUrl(+fileId, userId);
    return { url };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update application' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentApplicationDto,
    @Request() req,
  ) {
    const userId = req.user.roles.includes('admin') ? undefined : req.user.userId;
    const adminId = req.user.roles.includes('admin') ? req.user.userId : undefined;
    
    return this.documentApplicationsService.update(id, updateDto, userId, adminId);
  }

  @Patch(':id/status')
  @Roles('admin', 'staff')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update application status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string; statusMessage?: string },
    @Request() req,
  ) {
    return this.documentApplicationsService.updateStatus(
      id,
      statusDto.status as any,
      statusDto.statusMessage,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application' })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.roles.includes('admin') ? undefined : req.user.userId;
    await this.documentApplicationsService.remove(id, userId);
    return { message: 'Application deleted successfully' };
  }

  // Admin endpoints
  @Get('admin/all')
  @Roles('admin', 'staff')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all applications (Admin only)' })
  async getAllApplications() {
    return this.documentApplicationsService.findAll();
  }

  @Get('admin/stats')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get application statistics (Admin only)' })
  async getStats() {
    return this.documentApplicationsService.getApplicationStats();
  }
}
