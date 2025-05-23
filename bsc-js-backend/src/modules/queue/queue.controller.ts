import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  //Delete, // Uncomment if you want to implement delete functionality
  Request,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueueStatus } from './entities/queue.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createQueueDto: CreateQueueDto) {
    // Extract user ID from JWT token if authenticated
    const userId = req.user?.id || null;

    // Override the userId in the DTO with the authenticated user's ID
    // This prevents users from creating queues for other users
    if (userId) {
      createQueueDto.userId = userId;
      createQueueDto.isGuest = false;
    } else {
      createQueueDto.userId = undefined;
      createQueueDto.isGuest = true;
    }

    return this.queueService.create(createQueueDto);
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
    console.log(`PATCH /queue/${id}/status with body:`, body);

    try {
      // Validate the status enum value
      if (!Object.values(QueueStatus).includes(body.status)) {
        console.error(`Invalid status value: ${body.status}`);
        return {
          error: 'Invalid status value',
          validValues: Object.values(QueueStatus),
        };
      }

      // Update the queue status
      const result = await this.queueService.update(+id, {
        status: body.status,
      });
      console.log(`Queue ${id} status updated successfully to ${body.status}`);
      return result;
    } catch (error) {
      console.error(`Error updating queue ${id} status:`, error);
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
      console.error(`Error checking if queue ${id} exists:`, error);
      return { exists: false };
    }
  }
}
