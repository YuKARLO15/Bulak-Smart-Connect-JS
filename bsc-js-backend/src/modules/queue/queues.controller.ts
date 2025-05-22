import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueStatus } from './entities/queue.entity';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queueService: QueueService) {}

  // This endpoint is for supporting the legacy API path that the frontend is using
  @Get('walk-in') 
  async getWalkInQueues() {
    try {
      // Get both pending and serving queues with details using the service methods
      const [pendingQueuesWithDetails, servingQueuesWithDetails] = await Promise.all([
        this.queueService.findByStatusWithDetails(QueueStatus.PENDING),
        this.queueService.findByStatusWithDetails(QueueStatus.SERVING)
      ]);

      // Combine all queues
      const allQueues = [...pendingQueuesWithDetails, ...servingQueuesWithDetails];

      // Map to a frontend-friendly format
      return allQueues.map(queue => ({
        id: queue.id,
        queueNumber: queue.queueNumber,
        status: queue.status,
        counterNumber: queue.counterNumber,
        createdAt: queue.createdAt,
        completedAt: queue.completedAt,
        estimatedWaitTime: queue.estimatedWaitTime,
        firstName: queue.details?.firstName || null,
        lastName: queue.details?.lastName || null,
        middleInitial: queue.details?.middleInitial || null,
        reasonOfVisit: queue.details?.reasonOfVisit || null,
        address: queue.details?.address || null,
        phoneNumber: queue.details?.phoneNumber || null
      }));
    } catch (error) {
      console.error('Error fetching walk-in queues:', error);
      throw error;
    }
  }
}
