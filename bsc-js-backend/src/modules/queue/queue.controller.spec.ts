import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { QueueSchedulerService } from './queue-scheduler.service';

// Mock QueueSchedulerService
const mockQueueSchedulerService = {
  scheduleCleanup: jest.fn(),
  getScheduledTasks: jest.fn(),
  cancelScheduledTask: jest.fn(),
};

const mockQueueService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getStats: jest.fn(),
};

describe('QueueController', () => {
  let controller: QueueController;
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
        {
          provide: QueueSchedulerService,
          useValue: mockQueueSchedulerService,
        },
      ],
    }).compile();

    controller = module.get<QueueController>(QueueController);
    service = module.get<QueueService>(QueueService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
