import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  //Delete, // Uncomment if you want to implement delete functionality
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueueStatus } from './entities/queue.entity';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() createQueueDto: CreateQueueDto) {
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
}
