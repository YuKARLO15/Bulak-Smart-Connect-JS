import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueueGateway } from './queue.gateway';
import { Queue } from './entities/queue.entity';
import { QueueDetails } from './entities/queue-details.entity';
import { Counter } from './entities/counter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, QueueDetails, Counter]),
  ],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway],
  exports: [QueueService],
})
export class QueueModule {}