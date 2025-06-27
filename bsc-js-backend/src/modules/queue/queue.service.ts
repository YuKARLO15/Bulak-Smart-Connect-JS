/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, LessThan, In, Between } from 'typeorm';
import { Queue, QueueStatus } from './entities/queue.entity';
import { QueueDetails } from './entities/queue-details.entity';
import {
  Counter,
  //CounterStatus, //Uncomment if you need to use CounterStatus
} from '../counter/entities/counter.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueueGateway } from './queue.gateway';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    @InjectRepository(QueueDetails)
    private queueDetailsRepository: Repository<QueueDetails>,
    @InjectRepository(Counter)
    private counterRepository: Repository<Counter>,
    @Inject(forwardRef(() => QueueGateway))
    private queueGateway: QueueGateway,
  ) {}

  async create(createQueueDto: CreateQueueDto) {
    // Generate a queue number based on date and sequence
    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    // Get the start and end of today for accurate daily counting
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // Count ONLY queues created TODAY (this will reset to 0 each day)
    const todayCount = await this.queueRepository.count({
      where: {
        createdAt: Between(todayStart, todayEnd),
      },
    });

    // Format the queue number: YYYYMMDD-XXX (using 3 digits for daily sequence)
    // This keeps your existing backend format but ensures daily reset
    const queueNumber = `${dateStr}-${String(todayCount + 1).padStart(3, '0')}`;

    console.log(`Creating queue number: ${queueNumber} for today. Daily count: ${todayCount + 1}`);

    // Create and save the queue
    const queue = this.queueRepository.create({
      queueNumber,
      status: QueueStatus.PENDING,
      estimatedWaitTime: 15 * (todayCount + 1), // Simple estimation: 15 minutes per person
    });

    const savedQueue = await this.queueRepository.save(queue);

    // Simplify the user ID handling
    const userId =
      typeof createQueueDto.userId === 'number'
        ? createQueueDto.userId
        : typeof createQueueDto.userId === 'string' &&
            createQueueDto.userId !== 'guest'
          ? Number(createQueueDto.userId)
          : undefined;

    // isGuest is already a boolean from the DTO validation
    const isGuest = createQueueDto.isGuest ?? !userId;

    // Log for debugging
    console.log('=== QUEUE SERVICE CREATE DEBUG ===');
    console.log('Creating queue details with:', {
      providedUserId: createQueueDto.userId,
      parsedUserId: userId,
      providedIsGuest: createQueueDto.isGuest,
      finalIsGuest: isGuest,
    });

    // Create queue details
    const queueDetails = this.queueDetailsRepository.create({
      queueId: savedQueue.id,
      userId: userId,
      firstName: createQueueDto.firstName,
      lastName: createQueueDto.lastName,
      middleInitial: createQueueDto.middleInitial,
      address: createQueueDto.address,
      phoneNumber: createQueueDto.phoneNumber,
      reasonOfVisit: createQueueDto.reasonOfVisit,
      appointmentType: createQueueDto.appointmentType,
      isGuest: isGuest,
    });

    // Set the queue relation
    queueDetails.queue = savedQueue;

    const savedDetails = await this.queueDetailsRepository.save(queueDetails);

    console.log('Queue details saved with isGuest:', savedDetails.isGuest);

    // Get queue position
    const position = await this.getQueuePosition(savedQueue.id);

    const result = { queue: savedQueue, details: savedDetails, position };

    // Notify all clients that a new queue has been created
    this.queueGateway.server.emit('queueListUpdate', {
      action: 'created',
      queueId: savedQueue.id,
    });

    return result;
  }

  async findAll() {
    return await this.queueRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async findByStatus(status: QueueStatus) {
    return await this.queueRepository.find({
      where: { status },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number) {
    const queue = await this.queueRepository.findOne({
      where: { id },
    });

    if (!queue) {
      throw new NotFoundException(`Queue #${id} not found`);
    }

    return queue;
  }

  async findByQueueNumber(queueNumber: string) {
    const queue = await this.queueRepository.findOne({
      where: { queueNumber },
    });

    if (!queue) {
      throw new NotFoundException(`Queue #${queueNumber} not found`);
    }

    return queue;
  }

  async getQueueDetails(queueId: number) {
    const queue = await this.findOne(queueId);

    const details = await this.queueDetailsRepository.findOne({
      where: { queueId },
      relations: ['user'],
    });

    if (!details) {
      throw new NotFoundException(`Details for queue #${queueId} not found`);
    }

    const position = await this.getQueuePosition(queueId);

    return { queue, details, position };
  }
  async update(id: number, updateQueueDto: UpdateQueueDto) {
    console.log(`Updating queue ${id} with:`, updateQueueDto);

    try {
      // Find the queue
      const queue = await this.findOne(id);
      console.log('Found queue:', queue);

      if (updateQueueDto.status) {
        // Log the status change
        console.log(
          `Changing status from ${queue.status} to ${updateQueueDto.status}`,
        );
        queue.status = updateQueueDto.status;

        // If completed, set completion time
        if (updateQueueDto.status === QueueStatus.COMPLETED) {
          queue.completedAt = new Date();
        }
      }

      if (updateQueueDto.counterNumber) {
        queue.counterNumber = updateQueueDto.counterNumber;
      }

      // Save the updated queue
      const updatedQueue = await this.queueRepository.save(queue);
      console.log('Queue updated successfully:', updatedQueue);

      // Notify clients about the queue update
      this.queueGateway.notifyQueueUpdate(id, {
        action: 'updated',
        queue: updatedQueue,
      });

      return updatedQueue;
    } catch (error) {
      console.error(`Error updating queue ${id}:`, error);
      throw error;
    }
  }

  async getQueuePosition(queueId: number) {
    console.log(`Getting position for queue ID: ${queueId}`);

    const queue = await this.findOne(queueId);
    console.log(`Found queue:`, queue);

    // If the queue doesn't exist, return position 0
    if (!queue) {
      console.log('Queue not found');
      return { position: 0 };
    }

    // If the queue is not pending, return special position values
    if (queue.status === QueueStatus.SERVING) {
      console.log('Queue is currently being served');
      return { position: 0, status: 'serving' };
    }

    if (queue.status === QueueStatus.COMPLETED) {
      console.log('Queue is completed');
      return { position: 0, status: 'completed' };
    }

    if (queue.status !== QueueStatus.PENDING) {
      console.log(`Queue status is ${queue.status}, not pending`);
      return { position: 0, status: queue.status };
    }

    // Count serving queues (they are ahead of all pending queues)
    const servingCount = await this.queueRepository.count({
      where: {
        status: QueueStatus.SERVING,
      },
    });
    console.log(`Serving queues count: ${servingCount}`);

    // Count how many pending queues are ahead of this one (created earlier)
    const pendingAheadCount = await this.queueRepository.count({
      where: {
        status: QueueStatus.PENDING,
        createdAt: LessThan(queue.createdAt), // Queues created before this one
      },
    });
    console.log(`Pending queues ahead: ${pendingAheadCount}`);

    // Total position = serving queues + pending queues ahead + 1
    const position = servingCount + pendingAheadCount + 1;
    console.log(`Calculated position: ${position}`);

    return { position, status: 'pending' };
  }
  async getDetailsForMultipleQueues(queueIds: number[]) {
    console.log('Getting details for queue IDs:', queueIds);

    if (!queueIds || queueIds.length === 0) {
      return {};
    }

    const detailsMap = {};

    try {
      // Fetch all queue details in a single query for better performance
      const allDetails = await this.queueDetailsRepository.find({
        where: {
          queueId: In(queueIds),
        },
        relations: ['user'],
      });

      console.log(
        `Found ${allDetails.length} details for ${queueIds.length} queues`,
      );

      // Organize by queueId for easy lookup
      allDetails.forEach((detail) => {
        detailsMap[detail.queueId] = detail;
      });

      return detailsMap;
    } catch (error: unknown) {
      console.error('Error fetching details for multiple queues:', error);
      // Return empty details rather than failing
      return {};
    }
  }

  async findByStatusWithDetails(status: QueueStatus) {
    console.log(`Finding queues with status: ${status} and their details`);

    try {
      // First get all queues with this status
      const queues = await this.queueRepository.find({
        where: { status },
        order: { createdAt: 'ASC' },
      });

      console.log(`Found ${queues.length} queues with status ${status}`);

      if (queues.length === 0) {
        return [];
      }

      // Get all queue IDs
      const queueIds = queues.map((queue) => queue.id);

      // Fetch details for all these queues
      const detailsMap = await this.getDetailsForMultipleQueues(queueIds);

      // Combine queue and details data
      const result = queues.map((queue) => {
        return {
          ...queue,
          details: detailsMap[queue.id] || null,
        };
      });

      console.log(`Returning ${result.length} queues with details`);
      return result;
    } catch (error: unknown) {
      // Handle error message extraction without triggering ESLint
      let errorMessage: string;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      console.error('Error in findByStatusWithDetails:', errorMessage);

      if (error instanceof Error) {
        throw new Error(`Failed to get queue details: ${error.message}`);
      }
      if (typeof error === 'string') {
        throw new Error(`Failed to get queue details: ${error}`);
      }
      throw new Error('Failed to get queue details: An unknown error occurred');
    }
  }

  async callNext(counterId: number) {
    const counter = await this.counterRepository.findOne({
      where: { id: counterId },
      relations: ['currentQueue'],
    });

    if (!counter) {
      throw new NotFoundException(`Counter #${counterId} not found`);
    }

    // Mark current queue as completed if exists
    if (counter.currentQueue) {
      counter.currentQueue.status = QueueStatus.COMPLETED;
      counter.currentQueue.completedAt = new Date();
      await this.queueRepository.save(counter.currentQueue);
    }

    // Find the next pending queue
    const nextQueue = await this.queueRepository.findOne({
      where: { status: QueueStatus.PENDING },
      order: { createdAt: 'ASC' },
    });

    if (!nextQueue) {
      counter.currentQueueId = null;
      counter.currentQueue = null;
      await this.counterRepository.save(counter);
      return { counter, message: 'No more queues waiting' };
    }

    // Update the next queue
    nextQueue.status = QueueStatus.SERVING;
    nextQueue.counterNumber = counter.name;
    await this.queueRepository.save(nextQueue);

    // Update counter
    counter.currentQueueId = nextQueue.id;
    counter.currentQueue = nextQueue;
    await this.counterRepository.save(counter);

    // Get associated details
    const details = await this.queueDetailsRepository.findOne({
      where: { queueId: nextQueue.id },
    });

    const result = {
      counter,
      queue: nextQueue,
      details,
      message: 'Next queue called successfully',
    };

    if (nextQueue) {
      // Notify the specific queue room that it's their turn
      this.queueGateway.notifyQueueUpdate(nextQueue.id, {
        action: 'called',
        counterName: counter.name,
        counterId: counter.id,
      });
    }

    // Notify counter clients
    this.queueGateway.notifyCounterUpdate(counterId, {
      action: 'nextCalled',
      ...result,
    });

    return result;
  }

  async getStats() {
    const [
      pendingCount,
      servingCount,
      completedCount,
      cancelledCount,
      totalCount,
    ] = await Promise.all([
      this.queueRepository.count({ where: { status: QueueStatus.PENDING } }),
      this.queueRepository.count({ where: { status: QueueStatus.SERVING } }),
      this.queueRepository.count({ where: { status: QueueStatus.COMPLETED } }),
      this.queueRepository.count({ where: { status: QueueStatus.CANCELLED } }),
      this.queueRepository.count(),
    ]);

    // Calculate average wait time
    const completedQueues = await this.queueRepository.find({
      where: {
        status: QueueStatus.COMPLETED,
        completedAt: LessThanOrEqual(new Date()),
      },
      select: ['createdAt', 'completedAt'],
    });

    let averageWaitTime = 0;
    if (completedQueues.length > 0) {
      const totalWaitTimeMs = completedQueues.reduce((total, queue) => {
        return (
          total + (queue.completedAt.getTime() - queue.createdAt.getTime())
        );
      }, 0);
      averageWaitTime = Math.floor(
        totalWaitTimeMs / completedQueues.length / 60000,
      ); // Convert to minutes
    }

    return {
      pending: pendingCount,
      serving: servingCount,
      completed: completedCount,
      cancelled: cancelledCount,
      total: totalCount,
      averageWaitTime,
    };
  }

  // Add a counter
  async addCounter(name: string) {
    const counter = this.counterRepository.create({ name });
    return await this.counterRepository.save(counter);
  }

  // Get all counters
  async getCounters() {
    return await this.counterRepository.find({
      relations: ['currentQueue'],
    });
  }

  // Check if queue exists
  async checkExists(id: number): Promise<boolean> {
    const queue = await this.queueRepository.findOne({
      where: { id },
    });
    return !!queue;
  }

  async findByUserIdWithDetails(userId: string) {
    // Convert string userId to number since the database expects a number
    const userIdNumber = parseInt(userId, 10);

    if (isNaN(userIdNumber)) {
      console.error('Invalid userId provided:', userId);
      return [];
    }

    // First, let's find the user's queue details that contain the userId
    const userDetails = await this.queueDetailsRepository.find({
      where: {
        userId: userIdNumber,
      },
      relations: ['queue'],
    });

    // Extract queue IDs from the details
    const queueIds = userDetails.map((detail) => detail.queue.id);

    if (queueIds.length === 0) {
      return [];
    }

    // Find ALL queues (including completed ones) but filter them in the frontend
    // Change this to include completed queues temporarily so we can clear them
    return await this.queueRepository.find({
      where: {
        id: In(queueIds),
        // Remove status filter to get all queues including completed ones
      },
      relations: ['details'],
      order: { createdAt: 'ASC' },
    });
  }
}
