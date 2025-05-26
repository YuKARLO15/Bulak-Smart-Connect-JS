import { Test, TestingModule } from '@nestjs/testing';
import { QueueGateway } from './queue.gateway';
import { QueueService } from './queue.service';

describe('QueueGateway', () => {
  let gateway: QueueGateway;

  const mockQueueService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    joinQueue: jest.fn(),
    leaveQueue: jest.fn(),
    getQueueStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueGateway,
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    gateway = module.get<QueueGateway>(QueueGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});