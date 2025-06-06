import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService, UserStats } from './users.service';
import { Role } from '../roles/entities/role.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockResponse = {
        users: [
          {
            id: 1,
            email: 'user1@test.com',
            firstName: 'John',
            lastName: 'Doe',
            roles: ['citizen'],
            defaultRole: 'citizen',
            isActive: true,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockUsersService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(1, 10, undefined, undefined, {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(result).toEqual(mockResponse);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        role: undefined,
      });
    });

    it('should handle search and role filters', async () => {
      const mockResponse = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      mockUsersService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(1, 10, 'john', 'admin', {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'john',
        role: 'admin',
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1', {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should allow users to view their own profile', async () => {
      const mockUser = {
        id: 5,
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('5', {
        id: 5,
        email: 'user@test.com',
        roles: [{ name: 'citizen' }],
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(5);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };
      const mockUser = {
        id: 1,
        ...createUserDto,
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto, {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        firstName: 'Updated',
        lastName: 'Name',
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updateUserDto, {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockResponse = { message: 'User with ID 1 has been deleted' };
      mockUsersService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove('1', {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(result).toEqual(mockResponse);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('updateStatus', () => {
    it('should update user status', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: false,
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.updateStatus.mockResolvedValue(mockUser);

      const result = await controller.updateStatus('1', { isActive: false }, {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.updateStatus).toHaveBeenCalledWith(1, false);
    });
  });

  describe('getProfile', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.getProfile({
        id: 1,
        email: 'user@test.com',
        roles: [{ name: 'citizen' }],
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getStats', () => {
    it('should return user statistics', async () => {
      const mockStats: UserStats = {
        totalUsers: 10,
        activeUsers: 8,
        inactiveUsers: 2,
        usersByRole: [
          { roleName: 'citizen', count: 6 },
          { roleName: 'admin', count: 2 },
          { roleName: 'staff', count: 1 },
          { roleName: 'super_admin', count: 1 },
        ],
        recentUsers: [
          {
            id: 1,
            email: 'user1@test.com',
            username: 'user1',
            firstName: 'John',
            middleName: 'M', // Provide value for optional field
            lastName: 'Doe',
            name: 'John M Doe',
            nameExtension: 'Jr.', // Provide value for optional field
            contactNumber: '+639123456789', // Required field
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            defaultRole: {
              id: 4,
              name: 'citizen',
              description: 'Regular citizen',
              users: [],
            }, // Provide proper Role object
            defaultRoleId: 4,
            roles: [], // Required field
          },
        ],
      };
      mockUsersService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(mockUsersService.getStats).toHaveBeenCalled();
    });
  });
});