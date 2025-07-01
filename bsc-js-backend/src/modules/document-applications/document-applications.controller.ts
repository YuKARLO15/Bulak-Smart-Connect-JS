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
  //Request, // Uncomment if you need to use Request object
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentApplicationsService } from './document-applications.service';
import { CreateDocumentApplicationDto } from './dto/create-document-application.dto';
import { UpdateDocumentApplicationDto } from './dto/update-document-application.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { User } from '../../auth/decorators/user.decorator';
import { AuthenticatedUser } from '../../auth/jwt.strategy';
import { ApplicationStatus } from './entities/document-application.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Document Applications')
@Controller('document-applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DocumentApplicationsController {
  constructor(
    private readonly documentApplicationsService: DocumentApplicationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new document application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async create(
    @Body() createDto: CreateDocumentApplicationDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.documentApplicationsService.create(createDto, user.id);
  }

  @Post(':id/files')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(
            new BadRequestException(
              'Only JPEG, PNG, and PDF files are allowed',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload document file' })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentCategory') documentCategory: string,
    @User() user: AuthenticatedUser,
  ) {
    console.log('Received document category:', documentCategory); // Debug log

    if (!documentCategory) {
      throw new BadRequestException('Document category is required');
    }

    return this.documentApplicationsService.uploadFile(
      id,
      file,
      documentCategory,
      user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user applications' })
  async findAll(
    @Query('status') status?: string,
    @User() user?: AuthenticatedUser,
  ) {
    const userId = user?.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user?.id;
    return this.documentApplicationsService.findAll(userId);
  }

  @Get(':id/files')
  @ApiOperation({ summary: 'Get application files (latest per category)' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getApplicationFiles(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
  ) {
    const userId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user.id;

    console.log(
      `Getting files for application ${id}, user: ${user.email}, isPrivileged: ${!userId}`,
    );

    return await this.documentApplicationsService.getApplicationFiles(
      id,
      userId,
    );
  }

  @Get(':id/files/all')
  @ApiOperation({
    summary: 'Get all application files (privileged users only)',
  })
  @ApiResponse({ status: 200, description: 'All files retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getAllApplicationFiles(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
  ) {
    const userId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user.id;

    return await this.documentApplicationsService.getAllApplicationFiles(
      id,
      userId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific application' })
  async findOne(@Param('id') id: string, @User() user: AuthenticatedUser) {
    const userId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user.id;
    return this.documentApplicationsService.findOne(id, userId);
  }

  @Get('files/:fileId/download')
  @ApiOperation({ summary: 'Get file download URL' })
  async getFileDownloadUrl(
    @Param('fileId') fileId: string,
    @User() user: AuthenticatedUser,
  ) {
    const userId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user.id;
    const url = await this.documentApplicationsService.getFileDownloadUrl(
      +fileId,
      userId,
    );
    return { url };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update application' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentApplicationDto,
    @User() user: AuthenticatedUser,
  ) {
    const userId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user.id;
    const adminId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? user.id
      : undefined;

    return this.documentApplicationsService.update(
      id,
      updateDto,
      userId,
      adminId,
    );
  }

  @Patch(':id/status')
  @Roles('admin', 'staff', 'super_admin')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Update application status (Privileged users only)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string; statusMessage?: string },
    @User() user: AuthenticatedUser,
  ) {
    return this.documentApplicationsService.updateStatus(
      id,
      statusDto.status as ApplicationStatus,
      statusDto.statusMessage,
      user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application' })
  async remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    const userId = user.roles.some((role) =>
      ['admin', 'super_admin', 'staff'].includes(role.name),
    )
      ? undefined
      : user.id;
    await this.documentApplicationsService.remove(id, userId);
    return { message: 'Application deleted successfully' };
  }

  // Admin endpoints
  @Get('admin/all')
  @Roles('admin', 'staff', 'super_admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all applications (Privileged users only)' })
  async getAllApplications() {
    return this.documentApplicationsService.findAll();
  }

  @Get('admin/stats')
  @Roles('admin', 'super_admin')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Get application statistics (Admin/Super Admin only)',
  })
  async getStats(): Promise<
    Array<{ type: string; status: string; count: string }>
  > {
    return this.documentApplicationsService.getApplicationStats();
  }
}
