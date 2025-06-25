import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User } from './entities/user.entity';
import { AdminUpdateUserDto } from '../auth/dto/update-user.dto'; // Import from auth module
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: { roleName: string; count: number }[];
  recentUsers: Omit<User, 'password'>[];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async findAll(options: FindAllOptions) {
    const { page, limit, search, role } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.defaultRole', 'defaultRole')
      .leftJoinAndSelect('user.roles', 'roles');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('roles.name = :role', { role });
    }

    queryBuilder.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Remove passwords from response
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        roles: user.roles.map((role) => role.name),
        defaultRole: user.defaultRole?.name || 'citizen',
      };
    });

    return {
      users: sanitizedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['defaultRole', 'roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Remove password and format response
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      roles: user.roles.map((role) => role.name),
      defaultRole: user.defaultRole?.name || 'citizen',
    };
  }

  // Admin-only update method
  async adminUpdate(
    id: number,
    updateUserDto: AdminUpdateUserDto,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const {
      email,
      username,
      firstName,
      middleName,
      lastName,
      nameExtension,
      contactNumber,
      roleIds,
      defaultRoleId,
    } = updateUserDto;

    // Check email uniqueness if being updated
    if (email && email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check username uniqueness if being updated
    if (username && username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username },
      });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    // Update fields
    const updateData: any = {};

    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (contactNumber) updateData.contactNumber = contactNumber;

    // Handle optional fields
    if (middleName !== undefined) updateData.middleName = middleName;
    if (nameExtension !== undefined) updateData.nameExtension = nameExtension;
    if (defaultRoleId !== undefined) updateData.defaultRoleId = defaultRoleId;

    // Update name if name components changed
    if (
      firstName ||
      middleName !== undefined ||
      lastName ||
      nameExtension !== undefined
    ) {
      const newFirstName = firstName || user.firstName;
      const newMiddleName =
        middleName !== undefined ? middleName : user.middleName;
      const newLastName = lastName || user.lastName;
      const newNameExtension =
        nameExtension !== undefined ? nameExtension : user.nameExtension;

      updateData.name = `${newFirstName} ${newMiddleName ? newMiddleName + ' ' : ''}${newLastName}${newNameExtension ? ' ' + newNameExtension : ''}`;
    }

    await this.usersRepository.update(id, updateData);

    // Update roles if provided
    if (roleIds !== undefined) {
      // Remove existing roles and assign new ones
      await this.usersRepository
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(id)
        .remove(user.roles);

      if (roleIds.length > 0) {
        await this.rolesService.assignRolesToUser(id, roleIds);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.delete(id);
    return { message: `User with ID ${id} has been deleted` };
  }

  async updateStatus(id: number, isActive: boolean): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.update(id, { isActive });
    return this.findOne(id);
  }

  async getStats(): Promise<UserStats> {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({
      where: { isActive: true },
    });
    const inactiveUsers = totalUsers - activeUsers;

    // Get user count by role
    const roleStats = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .select('role.name', 'roleName')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    const usersByRole = roleStats.map((stat) => ({
      roleName: stat.roleName || 'No Role',
      count: parseInt(stat.count),
    }));

    // Get recent users (last 10)
    const recentUsers = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['defaultRole', 'roles'],
    });

    const sanitizedRecentUsers = recentUsers.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as Omit<User, 'password'>;
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
      recentUsers: sanitizedRecentUsers,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['defaultRole', 'roles'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['defaultRole', 'roles'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      nameExtension,
      contactNumber,
      name,
      roleIds,
      defaultRoleId,
    } = createUserDto;

    // Generate full name if not provided
    const fullName =
      name ||
      `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}${nameExtension ? ' ' + nameExtension : ''}`;

    // Check if user already exists
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    if (username) {
      const existingUserByUsername = await this.usersRepository.findOne({
        where: { username },
      });
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    try {
      // Create user
      const user = this.usersRepository.create({
        email,
        username,
        password, // Should be hashed by the caller
        firstName,
        middleName,
        lastName,
        nameExtension,
        contactNumber,
        name: fullName,
        defaultRoleId: defaultRoleId || 4, // Default to citizen
      });

      await this.usersRepository.save(user);

      // Assign roles if provided
      if (roleIds && roleIds.length > 0) {
        await this.rolesService.assignRolesToUser(user.id, roleIds);
      }

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}
