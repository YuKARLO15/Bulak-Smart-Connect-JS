import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let rolesService: RolesService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getRawMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockRolesService = {
    findByName: jest.fn(),
    assignRolesToUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockUser = { id: 1, ...createUserDto };
      const mockCitizenRole = { id: 1, name: 'citizen' };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockRolesService.findByName.mockResolvedValue(mockCitizenRole);
      
      // Mock findOne for the return call
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockUser,
        roles: ['citizen'],
        defaultRole: 'citizen',
      });

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockRolesService.assignRolesToUser).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        email: 'existing@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: 'existing@test.com' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        roles: [{ name: 'citizen' }],
        defaultRole: { name: 'citizen' },
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@test.com');
      expect(result.roles).toEqual(['citizen']);
      expect(result.defaultRole).toBe('citizen');
      expect(result.password).toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@test.com',
          roles: [{ name: 'citizen' }],
          defaultRole: { name: 'citizen' },
        },
        {
          id: 2,
          email: 'user2@test.com',
          roles: [{ name: 'admin' }],
          defaultRole: { name: 'admin' },
        },
      ];

      const queryBuilder = mockUserRepository.createQueryBuilder();
      queryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBe('User with ID 1 has been deleted');
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return user statistics', async () => {
      mockUserRepository.count
        .mockResolvedValueOnce(10) // total users
        .mockResolvedValueOnce(8); // active users

      const queryBuilder = mockUserRepository.createQueryBuilder();
      queryBuilder.getRawMany.mockResolvedValue([
        { roleName: 'citizen', count: '5' },
        { roleName: 'admin', count: '3' },
      ]);

      mockUserRepository.find.mockResolvedValue([
        { id: 1, email: 'user1@test.com', createdAt: new Date() },
        { id: 2, email: 'user2@test.com', createdAt: new Date() },
      ]);

      const result = await service.getStats();

      expect(result.totalUsers).toBe(10);
      expect(result.activeUsers).toBe(8);
      expect(result.inactiveUsers).toBe(2);
      expect(result.usersByRole).toHaveLength(2);
      expect(result.recentUsers).toHaveLength(2);
    });
  });
});