import { Test, TestingModule } from '@nestjs/testing';
import { QueuesController } from './queues.controller';
import { QueueService } from './queue.service';

describe('QueuesController', () => {
  let controller: QueuesController;

  const mockQueueService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getQueuesByDepartment: jest.fn(),
    getActiveQueues: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueuesController],
      providers: [
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    controller = module.get<QueuesController>(QueuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});