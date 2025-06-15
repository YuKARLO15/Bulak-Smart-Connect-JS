import { Controller, Get, Param } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueStatus } from './entities/queue.entity';

interface QueueDetails {
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  reasonOfVisit?: string;
  address?: string;
  phoneNumber?: string;
}

@Controller('queues')
export class QueuesController {
  constructor(private readonly queueService: QueueService) {}
  // This endpoint is for supporting the legacy API path that the frontend is using
  @Get('walk-in')
  async getWalkInQueues() {
    console.log('GET /queues/walk-in endpoint called');
    try {
      // Get both pending and serving queues with details using the service methods
      const [pendingQueuesWithDetails, servingQueuesWithDetails] =
        await Promise.all([
          this.queueService.findByStatusWithDetails(QueueStatus.PENDING),
          this.queueService.findByStatusWithDetails(QueueStatus.SERVING),
        ]);

      console.log('Found pending queues:', pendingQueuesWithDetails.length);
      console.log('Found serving queues:', servingQueuesWithDetails.length);

      // Combine all queues
      const allQueues = [
        ...pendingQueuesWithDetails,
        ...servingQueuesWithDetails,
      ];

      // Extract details from the nested structure and flatten them for the frontend
      const result = allQueues.map((queue) => {
        // For debugging
        console.log('Processing queue:', queue.id, 'status:', queue.status);

        // Handle potential null/undefined details
        const details: QueueDetails | null = Array.isArray(queue.details)
          ? (queue.details[0] as QueueDetails)
          : (queue.details as QueueDetails);

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
          phoneNumber: details?.phoneNumber || null,
        };
      });

      console.log(`Returning ${result.length} walk-in queues`);
      return result;
    } catch (err: unknown) {
      console.error('Error fetching walk-in queues:', err);
      throw err;
    }
  }

  @Get('user/:userId')
  async getUserQueues(@Param('userId') userId: string) {
    console.log('GET /queues/user/' + userId + ' endpoint called');
    try {
      // Find queues for the specific user that are not completed
      const userQueues = await this.queueService.findByUserIdWithDetails(userId);
      
      console.log('Found user queues:', userQueues.length);
      
      const result = userQueues.map((queue) => {
        const details = Array.isArray(queue.details) 
          ? queue.details[0] 
          : queue.details;

        return {
          id: queue.id,
          queueNumber: queue.queueNumber,
          status: queue.status,
          counterNumber: queue.counterNumber,
          createdAt: queue.createdAt,
          completedAt: queue.completedAt,
          firstName: details?.firstName || null,
          lastName: details?.lastName || null,
          reasonOfVisit: details?.reasonOfVisit || null,
        };
      });

      return result;
    } catch (err) {
      console.error('Error fetching user queues:', err);
      throw err;
    }
  }

  @Get(':id')
  async getQueueById(@Param('id') id: string) {
    console.log('GET /queues/' + id + ' endpoint called');
    try {
      const queueId = parseInt(id, 10);
      if (isNaN(queueId)) {
        throw new Error('Invalid queue ID');
      }

      const queue = await this.queueService.findOne(queueId);
      
      if (!queue) {
        throw new Error('Queue not found');
      }

      const details = Array.isArray(queue.details) 
        ? queue.details[0] 
        : queue.details;

      return {
        id: queue.id,
        queueNumber: queue.queueNumber,
        status: queue.status,
        counterNumber: queue.counterNumber,
        createdAt: queue.createdAt,
        completedAt: queue.completedAt,
        firstName: details?.firstName || null,
        lastName: details?.lastName || null,
        reasonOfVisit: details?.reasonOfVisit || null,
      };
    } catch (err) {
      console.error('Error fetching queue:', err);
      throw err;
    }
  }
}
