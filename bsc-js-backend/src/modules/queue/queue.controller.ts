import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  //Delete, // Uncomment if you want to implement delete functionality
  //Request, // Uncomment if you want to use Request object
  UseGuards,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueueStatus } from './entities/queue.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { User as UserEntity } from '../../users/entities/user.entity';
import { QueueSchedulerService } from './queue-scheduler.service';

@Controller('queue')
export class QueueController {
  private readonly logger = new Logger(QueueController.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly queueSchedulerService: QueueSchedulerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createQueueDto: CreateQueueDto, @User() user?: UserEntity) {
    // Extract user ID from authenticated user
    const userId = user?.id || null;

    this.logger.log('=== QUEUE CREATION BACKEND DEBUG ===');
    this.logger.log('Queue creation - User from JWT:', user);
    this.logger.log('Original DTO received:', createQueueDto);
    this.logger.log('DTO isGuest value:', createQueueDto.isGuest);
    this.logger.log('DTO isGuest type:', typeof createQueueDto.isGuest);

    // Set userId and respect the isGuest boolean from frontend
    if (userId) {
      createQueueDto.userId = userId;
      // If isGuest is not provided, default to false for authenticated users
      if (createQueueDto.isGuest === undefined) {
        createQueueDto.isGuest = false;
      }
    } else {
      createQueueDto.userId = undefined;
      createQueueDto.isGuest = true;
    }

    this.logger.log('Final DTO values:');
    this.logger.log('- userId:', createQueueDto.userId);
    this.logger.log('- isGuest:', createQueueDto.isGuest);

    return this.queueService.create(createQueueDto);
  }

  @Post('manual')
  @UseGuards(JwtAuthGuard)
  async createManualQueue(
    @Body() createQueueDto: CreateQueueDto,
    @User() user?: UserEntity,
  ) {
    try {
      this.logger.log('Manual queue creation by admin:', user?.id);
      this.logger.log('Received DTO:', createQueueDto);

      // Set default values for manual/guest queues
      const queueData: CreateQueueDto = {
        ...createQueueDto,
        userId: undefined, // Manual queues don't have user IDs
        isGuest: true, // Always true for manual queues
        // Don't override appointmentType - let it come from the frontend
      };

      this.logger.log('Processed queue data:', queueData);

      const result = await this.queueService.create(queueData);

      return {
        success: true,
        queue: result.queue || result,
        details: result.details,
        message: 'Manual queue created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating manual queue:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: QueueStatus) {
    return this.queueService.findByStatus(status);
  }

  @Get('pending')
  findPending() {
    return this.queueService.findByStatus(QueueStatus.PENDING);
  }

  @Get('serving')
  findServing() {
    return this.queueService.findByStatus(QueueStatus.SERVING);
  }

  @Get('completed')
  findCompleted() {
    return this.queueService.findByStatus(QueueStatus.COMPLETED);
  }

  // Endpoint for pending queues with details
  @Get('pending/details')
  findPendingWithDetails() {
    return this.queueService.findByStatusWithDetails(QueueStatus.PENDING);
  }

  // Endpoint for serving queues with details
  @Get('serving/details')
  findServingWithDetails() {
    return this.queueService.findByStatusWithDetails(QueueStatus.SERVING);
  }

  // Endpoint for bulk fetching queue details
  @Post('bulk-details')
  getDetailsForMultipleQueues(@Body() body: { queueIds: number[] }) {
    return this.queueService.getDetailsForMultipleQueues(body.queueIds);
  }
  // Endpoint for updating queue status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: QueueStatus },
  ) {
    this.logger.log(`PATCH /queue/${id}/status with body:`, body);

    try {
      // Validate the status enum value
      if (!Object.values(QueueStatus).includes(body.status)) {
        this.logger.error(`Invalid status value: ${body.status}`);
        return {
          error: 'Invalid status value',
          validValues: Object.values(QueueStatus),
        };
      }

      // Update the queue status
      const result = await this.queueService.update(+id, {
        status: body.status,
      });
      this.logger.log(
        `Queue ${id} status updated successfully to ${body.status}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error updating queue ${id} status:`, error);
      throw error;
    }
  }

  @Get('stats')
  getStats() {
    return this.queueService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(+id);
  }

  @Get('number/:queueNumber')
  findByQueueNumber(@Param('queueNumber') queueNumber: string) {
    return this.queueService.findByQueueNumber(queueNumber);
  }

  @Get(':id/details')
  getQueueDetails(@Param('id') id: string) {
    return this.queueService.getQueueDetails(+id);
  }

  @Get(':id/position')
  getQueuePosition(@Param('id') id: string) {
    return this.queueService.getQueuePosition(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.update(+id, updateQueueDto);
  }

  @Post('counter/:counterId/call-next')
  callNext(@Param('counterId') counterId: string) {
    return this.queueService.callNext(+counterId);
  }

  @Post('counter')
  addCounter(@Body() data: { name: string }) {
    return this.queueService.addCounter(data.name);
  }

  @Get('counters')
  getCounters() {
    return this.queueService.getCounters();
  }

  @Get(':id/exists')
  async checkQueueExists(@Param('id') id: string) {
    try {
      const exists = await this.queueService.checkExists(+id);
      return { exists };
    } catch (error) {
      this.logger.error(`Error checking if queue ${id} exists:`, error);
      return { exists: false };
    }
  }

  @Post('admin/daily-reset')
  @UseGuards(JwtAuthGuard)
  async manualDailyReset(@User() user?: UserEntity) {
    // Only allows privileged users
    if (
      !user ||
      !user.roles?.some((role) =>
        ['admin', 'super_admin', 'staff'].includes(role.name),
      )
    ) {
      this.logger.log(
        `Unauthorized reset attempt by user: ${user?.username || 'unknown'} with roles: ${user?.roles?.map((r) => r.name).join(', ') || 'none'}`,
      );
      throw new UnauthorizedException(
        'Admin, Super Admin, or Staff privileges required',
      );
    }

    this.logger.log(
      `Manual daily reset triggered by ${user.roles.map((r) => r.name).join(', ')}: ${user.username}`,
    );

    try {
      await this.queueSchedulerService.manualDailyReset();

      return {
        success: true,
        message: 'Daily queue reset completed successfully',
        timestamp: new Date(),
        triggeredBy: user.username,
      };
    } catch (error) {
      this.logger.error('Error during manual daily reset:', error);
      throw new InternalServerErrorException('Failed to perform daily reset');
    }
  }

  @Get('admin/pending-count')
  @UseGuards(JwtAuthGuard)
  async getTodayPendingCount(@User() user?: UserEntity) {
    // Only allows privileged users
    if (
      !user ||
      !user.roles?.some((role) =>
        ['admin', 'super_admin', 'staff'].includes(role.name),
      )
    ) {
      throw new UnauthorizedException('Admin access required');
    }

    const count = await this.queueSchedulerService.getTodayPendingCount();
    return {
      pendingCount: count,
      date: new Date().toDateString(),
    };
  }
}
