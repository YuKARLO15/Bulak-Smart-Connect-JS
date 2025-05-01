import { IsString, IsEnum, IsOptional } from 'class-validator';
import { QueueStatus } from '../entities/queue.entity';

export class UpdateQueueDto {
  @IsEnum(QueueStatus)
  @IsOptional()
  status?: QueueStatus;

  @IsString()
  @IsOptional()
  counterNumber?: string;
}
