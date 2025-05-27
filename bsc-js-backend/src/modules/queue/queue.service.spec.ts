import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { Queue } from './entities/queue.entity';
import { QueueDetails } from './entities/queue-details.entity';
import { Counter } from '../counter/entities/counter.entity';
import { QueueGateway } from './queue.gateway';

describe('QueueService', () => {
  let service: QueueService;

  const mockQueueRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  const mockQueueDetailsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCounterRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockQueueGateway = {
    server: {
      emit: jest.fn(),
    },
    handleConnection: jest.fn(),
    handleDisconnect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getRepositoryToken(Queue),
          useValue: mockQueueRepository,
        },
        {
          provide: getRepositoryToken(QueueDetails),
          useValue: mockQueueDetailsRepository,
        },
        {
          provide: getRepositoryToken(Counter),
          useValue: mockCounterRepository,
        },
        {
          provide: QueueGateway,
          useValue: mockQueueGateway,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
