import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueStatus } from './entities/queue.entity';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queueService: QueueService) {}

  // This endpoint is for supporting the legacy API path that the frontend is using
  @Get('walk-in') 
  async getWalkInQueues() {
    // Get both pending and serving queues
    const [pendingQueues, servingQueues] = await Promise.all([
      this.queueService.findByStatus(QueueStatus.PENDING),
      this.queueService.findByStatus(QueueStatus.SERVING)
    ]);

    // Combine all queues
    const allQueues = [...pendingQueues, ...servingQueues];

    // Get queue details for all queues
    const queueIds = allQueues.map(queue => queue.id);
    
    // Get details for all of these queues
    const detailsPromises = queueIds.map(async (id) => {
      try {
        return await this.queueService.getQueueDetails(id);
      } catch (error) {
        console.error(`Failed to get details for queue ${id}:`, error);
        return null;
      }
    });

    const queueDetailsArray = await Promise.all(detailsPromises);
    
    // Combine queue and details
    return allQueues.map(queue => {
      const detailsObj = queueDetailsArray.find(details => 
        details && details.queue && details.queue.id === queue.id
      );
      
      return {
        ...queue,
        firstName: detailsObj?.details?.firstName || null,
        lastName: detailsObj?.details?.lastName || null,
        reasonOfVisit: detailsObj?.details?.reasonOfVisit || null
      };
    });
  }
}
