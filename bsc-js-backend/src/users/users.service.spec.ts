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
        roleIds: [4], // Changed to citizen role ID
      };

      const mockUser = { 
        id: 1, 
        email: createUserDto.email,
        username: createUserDto.username,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        name: 'Test User',
        defaultRoleId: 4, // citizen role as default
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // Email check
        .mockResolvedValueOnce(null); // Username check
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockRolesService.assignRolesToUser).toHaveBeenCalledWith(1, [4]); // citizen role ID
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
        password: 'hashedPassword',
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
          firstName: 'User',
          lastName: 'One',
          password: 'hashedPassword1',
          roles: [{ name: 'citizen' }],
          defaultRole: { name: 'citizen' },
        },
        {
          id: 2,
          email: 'user2@test.com',
          firstName: 'User',
          lastName: 'Two',
          password: 'hashedPassword2',
          roles: [{ name: 'admin' }],
          defaultRole: { name: 'admin' },
        },
      ];

      // Override the mock for this specific test
      mockUserRepository.createQueryBuilder.mockReturnValueOnce({
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
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 2]),
        getRawMany: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.users[0].roles).toEqual(['citizen']);
      expect(result.users[1].roles).toEqual(['admin']);
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

      // Override the mock for this specific test
      mockUserRepository.createQueryBuilder.mockReturnValueOnce({
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
        getRawMany: jest.fn().mockResolvedValue([
          { roleName: 'citizen', count: '5' },
          { roleName: 'admin', count: '3' },
        ]),
      });

      mockUserRepository.find.mockResolvedValueOnce([
        { 
          id: 1, 
          email: 'user1@test.com', 
          firstName: 'User',
          lastName: 'One',
          password: 'hashedPassword1',
          createdAt: new Date(),
          defaultRole: { name: 'citizen' },
          roles: [{ name: 'citizen' }]
        },
        { 
          id: 2, 
          email: 'user2@test.com', 
          firstName: 'User',
          lastName: 'Two',
          password: 'hashedPassword2',
          createdAt: new Date(),
          defaultRole: { name: 'admin' },
          roles: [{ name: 'admin' }]
        },
      ]);

      const result = await service.getStats();

      expect(result.totalUsers).toBe(10);
      expect(result.activeUsers).toBe(8);
      expect(result.inactiveUsers).toBe(2);
      expect(result.usersByRole).toHaveLength(2);
      expect(result.usersByRole[0]).toEqual({ roleName: 'citizen', count: 5 });
      expect(result.usersByRole[1]).toEqual({ roleName: 'admin', count: 3 });
      expect(result.recentUsers).toHaveLength(2);
    });
  });
});