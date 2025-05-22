import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueStatus } from './entities/queue.entity';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queueService: QueueService) {}
  // This endpoint is for supporting the legacy API path that the frontend is using
  @Get('walk-in') 
  async getWalkInQueues() {
    console.log('GET /queues/walk-in endpoint called');
    try {
      // Get both pending and serving queues with details using the service methods
      const [pendingQueuesWithDetails, servingQueuesWithDetails] = await Promise.all([
        this.queueService.findByStatusWithDetails(QueueStatus.PENDING),
        this.queueService.findByStatusWithDetails(QueueStatus.SERVING)
      ]);

      console.log('Found pending queues:', pendingQueuesWithDetails.length);
      console.log('Found serving queues:', servingQueuesWithDetails.length);

      // Combine all queues
      const allQueues = [...pendingQueuesWithDetails, ...servingQueuesWithDetails];

      // Extract details from the nested structure and flatten them for the frontend
      const result = allQueues.map(queue => {
        // For debugging
        console.log('Processing queue:', queue.id, 'status:', queue.status);
        
        // Handle potential null/undefined details
        const details = Array.isArray(queue.details) ? queue.details[0] : queue.details;
        
        return {
          id: queue.id,
          queueNumber: queue.queueNumber,
          status: queue.status,
          counterNumber: queue.counterNumber,
          createdAt: queue.createdAt,
          completedAt: queue.completedAt,
          estimatedWaitTime: queue.estimatedWaitTime,
          firstName: details?.firstName || null,
          lastName: details?.lastName || null,
          middleInitial: details?.middleInitial || null,
          reasonOfVisit: details?.reasonOfVisit || null,
          address: details?.address || null,
          phoneNumber: details?.phoneNumber || null
        };
      });

      console.log(`Returning ${result.length} walk-in queues`);
      return result;
    } catch (error) {
      console.error('Error fetching walk-in queues:', error);
      throw error;
    }
  }
}
