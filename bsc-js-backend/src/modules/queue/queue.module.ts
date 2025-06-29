import {
  Module,
  //forwardRef, // Uncomment if you need to use forwardRef
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueuesController } from './queues.controller';
import { QueueGateway } from './queue.gateway';
import { QueueSchedulerService } from './queue-scheduler.service';
import { Queue } from './entities/queue.entity';
import { QueueDetails } from './entities/queue-details.entity';
import { Counter } from '../counter/entities/counter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, QueueDetails, Counter]),
    ScheduleModule.forRoot(),
  ],
  controllers: [QueueController, QueuesController],
  providers: [QueueService, QueueGateway, QueueSchedulerService],
  exports: [QueueService, QueueGateway, QueueSchedulerService],
})
export class QueueModule {}
