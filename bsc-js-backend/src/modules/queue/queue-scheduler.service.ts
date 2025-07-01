import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Queue, QueueStatus } from './entities/queue.entity';
import { QueueGateway } from './queue.gateway';

@Injectable()
export class QueueSchedulerService {
  private readonly logger = new Logger(QueueSchedulerService.name);
  private isResetInProgress = false;

  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private queueGateway: QueueGateway,
  ) {}

  // Run every day at 11:59 PM (23:59)
  @Cron('59 23 * * *', {
    name: 'daily-queue-reset',
    timeZone: 'Asia/Manila',
  })
  async handleDailyQueueReset() {
    // ✅ FIXED: Prevent concurrent execution
    if (this.isResetInProgress) {
      this.logger.warn('🚫 Daily reset already in progress, skipping...');
      return;
    }

    this.isResetInProgress = true;
    this.logger.log('🔄 Starting daily queue reset process...');

    try {
      // ✅ FIXED: Better timezone handling
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999,
      );

      this.logger.log(
        `🗓️ Searching for queues between: ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`,
      );

      // Get all pending queues created today
      const pendingQueues = await this.queueRepository.find({
        where: {
          status: QueueStatus.PENDING,
          createdAt: Between(startOfDay, endOfDay),
        },
      });

      this.logger.log(
        `📋 Found ${pendingQueues.length} pending queues to cancel`,
      );

      if (pendingQueues.length > 0) {
        // Mark all pending queues as cancelled
        const cancelledQueues = await this.queueRepository.save(
          pendingQueues.map((queue) => ({
            ...queue,
            status: QueueStatus.CANCELLED,
            completedAt: new Date(),
          })),
        );

        this.logger.log(
          `❌ Cancelled ${cancelledQueues.length} pending queues`,
        );

        // Notify clients about cancellations
        for (const queue of cancelledQueues) {
          this.queueGateway.notifyQueueUpdate(queue.id, {
            action: 'cancelled',
            reason: 'End of day auto-cancellation',
            queue: queue,
          });
        }

        // Send general notification
        this.queueGateway.server.emit('dailyQueueReset', {
          cancelledCount: cancelledQueues.length,
          timestamp: new Date(),
          message:
            'Daily queue reset completed. All pending queues have been cancelled.',
        });
      }

      // Also cancel any serving queues
      const servingQueues = await this.queueRepository.find({
        where: {
          status: QueueStatus.SERVING,
          createdAt: Between(startOfDay, endOfDay),
        },
      });

      if (servingQueues.length > 0) {
        const cancelledServingQueues = await this.queueRepository.save(
          servingQueues.map((queue) => ({
            ...queue,
            status: QueueStatus.CANCELLED,
            completedAt: new Date(),
          })),
        );

        this.logger.log(
          `❌ Cancelled ${cancelledServingQueues.length} serving queues`,
        );
      }

      this.logger.log('✅ Daily queue reset completed successfully');
      await this.logDailyStatistics(startOfDay, endOfDay);
    } catch (error) {
      this.logger.error('❌ Error during daily queue reset:', error);
      throw error; // ✅ FIXED: Propagate error for proper handling
    } finally {
      this.isResetInProgress = false; // ✅ FIXED: Always reset flag
    }
  }

  // Optional: Log daily statistics
  private async logDailyStatistics(startOfDay: Date, endOfDay: Date) {
    try {
      const [completed, cancelled, total] = await Promise.all([
        this.queueRepository.count({
          where: {
            status: QueueStatus.COMPLETED,
            createdAt: Between(startOfDay, endOfDay),
          },
        }),
        this.queueRepository.count({
          where: {
            status: QueueStatus.CANCELLED,
            createdAt: Between(startOfDay, endOfDay),
          },
        }),
        this.queueRepository.count({
          where: {
            createdAt: Between(startOfDay, endOfDay),
          },
        }),
      ]);

      this.logger.log(`📊 Daily Statistics for ${startOfDay.toDateString()}:`);
      this.logger.log(`   Total Queues: ${total}`);
      this.logger.log(`   Completed: ${completed}`);
      this.logger.log(`   Cancelled: ${cancelled}`);
      this.logger.log(
        `   Completion Rate: ${total > 0 ? ((completed / total) * 100).toFixed(1) : 0}%`,
      );
    } catch (error) {
      this.logger.error('Error logging daily statistics:', error);
    }
  }

  // Manual trigger for testing or admin use
  async manualDailyReset() {
    this.logger.log('🔄 Manual daily queue reset triggered');
    return await this.handleDailyQueueReset(); // ✅ FIXED: Return result
  }

  // Get pending queues count for today
  async getTodayPendingCount(): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    return await this.queueRepository.count({
      where: {
        status: QueueStatus.PENDING,
        createdAt: Between(startOfDay, endOfDay),
      },
    });
  }
}
