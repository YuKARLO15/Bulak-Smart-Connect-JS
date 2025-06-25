import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService, UserStats } from './users.service';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AdminUpdateUserDto } from '../auth/dto/update-user.dto';
import { AuthenticatedUser } from '../auth/jwt.strategy';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    adminUpdate: jest.fn(),
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

      const mockQuery: UserQueryDto = {
        page: 1,
        limit: 10,
      };

      const mockUser: AuthenticatedUser = {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      };

      const result = await controller.findAll(mockQuery, { user: mockUser });

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

      const mockQuery: UserQueryDto = {
        page: 1,
        limit: 10,
        search: 'john',
        role: 'admin',
      };

      const mockUser: AuthenticatedUser = {
        id: 1,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      };

      await controller.findAll(mockQuery, { user: mockUser });

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'john',
        role: 'admin',
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id for admin', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['citizen'],
        defaultRole: 'citizen',
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockAuthUser: AuthenticatedUser = {
        id: 2,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      };

      const result = await controller.findOne('1', { user: mockAuthUser });

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

      const mockAuthUser: AuthenticatedUser = {
        id: 5,
        email: 'user@test.com',
        roles: [{ name: 'citizen' }],
      };

      const result = await controller.findOne('5', { user: mockAuthUser });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(5);
    });
  });

  describe('update', () => {
    it('should update a user (admin only)', async () => {
      const updateUserDto: AdminUpdateUserDto = {
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
      mockUsersService.adminUpdate.mockResolvedValue(mockUser);

      const mockAuthUser: AuthenticatedUser = {
        id: 2,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      };

      const result = await controller.update('1', updateUserDto, {
        user: mockAuthUser,
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.adminUpdate).toHaveBeenCalledWith(
        1,
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user (admin only)', async () => {
      const mockResponse = { message: 'User with ID 1 has been deleted' };
      mockUsersService.remove.mockResolvedValue(mockResponse);

      const mockAuthUser: AuthenticatedUser = {
        id: 2,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      };

      const result = await controller.remove('1', { user: mockAuthUser });

      expect(result).toEqual(mockResponse);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('updateStatus', () => {
    it('should update user status (admin only)', async () => {
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

      const updateStatusDto: UpdateUserStatusDto = { isActive: false };
      const mockAuthUser: AuthenticatedUser = {
        id: 2,
        email: 'admin@test.com',
        roles: [{ name: 'admin' }],
      };

      const result = await controller.updateStatus('1', updateStatusDto, {
        user: mockAuthUser,
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

      const mockAuthUser: AuthenticatedUser = {
        id: 1,
        email: 'user@test.com',
        roles: [{ name: 'citizen' }],
      };

      const result = await controller.getProfile({ user: mockAuthUser });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getStats', () => {
    it('should return user statistics (admin only)', async () => {
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
            middleName: 'M',
            lastName: 'Doe',
            name: 'John M Doe',
            nameExtension: 'Jr.',
            contactNumber: '+639123456789',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            defaultRole: {
              id: 4,
              name: 'citizen',
              description: 'Regular citizen',
              users: [],
            },
            defaultRoleId: 4,
            roles: [],
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
