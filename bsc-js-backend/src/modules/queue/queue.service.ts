import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
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

    // Get the count of queues created today to determine the sequence number
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await this.queueRepository.count({
      where: {
        createdAt: LessThanOrEqual(today),
      },
    });

    // Format the queue number: YYYYMMDD-XXXX where XXXX is the sequence number
    const queueNumber = `${dateStr}-${String(todayCount + 1).padStart(4, '0')}`;

    // Create and save the queue
    const queue = this.queueRepository.create({
      queueNumber,
      status: QueueStatus.PENDING,
      estimatedWaitTime: 15 * (todayCount + 1), // Simple estimation: 15 minutes per person
    });

    const savedQueue = await this.queueRepository.save(queue);

    // Simplify the user ID handling - trust what the controller provided
    const userId =
      typeof createQueueDto.userId === 'number'
        ? createQueueDto.userId
        : typeof createQueueDto.userId === 'string' && createQueueDto.userId !== 'guest'
        ? Number(createQueueDto.userId)
        : undefined;

    const isGuest = createQueueDto.isGuest || !userId;

    // Log for debugging
    console.log('Creating queue details with:', {
      providedUserId: createQueueDto.userId,
      parsedUserId: userId,
      isGuest,
    });

    // Create queue details using the simplified userId
    const queueDetails = this.queueDetailsRepository.create({
      queueId: savedQueue.id,
      userId: userId, // Use the simplified userId
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

    await this.queueDetailsRepository.save(queueDetails);

    // Get queue position
    const position = await this.getQueuePosition(savedQueue.id);

    const result = { queue: savedQueue, details: queueDetails, position };

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
    const queue = await this.findOne(id);

    if (updateQueueDto.status) {
      queue.status = updateQueueDto.status;

      // If completed, set completion time
      if (updateQueueDto.status === QueueStatus.COMPLETED) {
        queue.completedAt = new Date();
      }
    }

    if (updateQueueDto.counterNumber) {
      queue.counterNumber = updateQueueDto.counterNumber;
    }

    const updatedQueue = await this.queueRepository.save(queue);

    // Notify clients about the queue update
    this.queueGateway.notifyQueueUpdate(id, {
      action: 'updated',
      queue: updatedQueue,
    });

    return updatedQueue;
  }

  async getQueuePosition(queueId: number) {
    const queue = await this.findOne(queueId);

    // If the queue is not pending, it's not in line
    if (queue.status !== QueueStatus.PENDING) {
      return 0;
    }

    // Count how many pending queues are ahead of this one
    const position = await this.queueRepository.count({
      where: {
        status: QueueStatus.PENDING,
        createdAt: LessThanOrEqual(queue.createdAt),
        id: LessThanOrEqual(queueId), // Break ties using ID
      },
    });

    return position;
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
      where: { id }
    });
    return !!queue;
  }
}
