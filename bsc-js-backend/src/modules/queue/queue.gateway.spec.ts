import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { QueueGateway } from './queue.gateway';
import { QueueService } from './queue.service';

const mockQueueService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getStats: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case 'WS_CORS_ORIGIN':
        return 'http://localhost:5173';
      case 'NODE_ENV':
        return 'test';
      default:
        return '';
    }
  }),
};

describe('QueueGateway', () => {
  let gateway: QueueGateway;
  let queueService: QueueService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueGateway,
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    gateway = module.get<QueueGateway>(QueueGateway);
    queueService = module.get<QueueService>(QueueService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
    expect(queueService).toBeDefined();
    expect(configService).toBeDefined();
  });
});
