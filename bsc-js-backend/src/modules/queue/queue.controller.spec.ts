import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

describe('QueueController', () => {
  let controller: QueueController;

  const mockQueueService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    joinQueue: jest.fn(),
    leaveQueue: jest.fn(),
    getQueueStatus: jest.fn(),
    getNextInQueue: jest.fn(),
    findByStatus: jest.fn(),
    findByStatusWithDetails: jest.fn(),
    getDetailsForMultipleQueues: jest.fn(),
    callNext: jest.fn(),
    addCounter: jest.fn(),
    getCounters: jest.fn(),
    checkExists: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    controller = module.get<QueueController>(QueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
