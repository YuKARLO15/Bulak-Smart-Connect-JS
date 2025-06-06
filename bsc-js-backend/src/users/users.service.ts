import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
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

  async create(createUserDto: CreateUserDto): Promise<any> {
    const {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      nameExtension,
      contactNumber,
      roleIds,
      defaultRoleId,
    } = createUserDto;

    // Check if email already exists
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    if (username) {
      const existingUserByUsername = await this.usersRepository.findOne({
        where: { username },
      });
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Validate password
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Generate full name
    const name = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}${nameExtension ? ' ' + nameExtension : ''}`;

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user - handle optional fields properly
    const userData: Partial<User> = {
      email,
      username: username || email, // Use email as username if not provided
      password: hashedPassword,
      firstName,
      lastName,
      name,
      contactNumber: contactNumber || '', // Required field, use empty string if not provided
      isActive: true,
    };

    // Only set optional fields if provided
    if (middleName !== undefined) {
      userData.middleName = middleName;
    }
    if (nameExtension !== undefined) {
      userData.nameExtension = nameExtension;
    }
    if (defaultRoleId) {
      userData.defaultRoleId = defaultRoleId;
    }

    // Create and save the user entity
    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user); // This returns a single User object

    // Assign roles if provided
    if (roleIds && roleIds.length > 0) {
      await this.rolesService.assignRolesToUser(savedUser.id, roleIds);
    } else {
      // Default to citizen role
      const citizenRole = await this.rolesService.findByName('citizen');
      await this.rolesService.assignRolesToUser(savedUser.id, [citizenRole.id]);
      
      if (!defaultRoleId) {
        // Update the saved user with the default role ID
        await this.usersRepository.update(savedUser.id, { 
          defaultRoleId: citizenRole.id 
        });
      }
    }

    return this.findOne(savedUser.id);
  }

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

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Remove passwords from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        roles: user.roles.map(role => role.name),
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
      roles: user.roles.map(role => role.name),
      defaultRole: user.defaultRole?.name || 'citizen',
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      nameExtension,
      contactNumber,
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
    
    // Handle optional fields - can be set to null/empty
    if (middleName !== undefined) updateData.middleName = middleName;
    if (nameExtension !== undefined) updateData.nameExtension = nameExtension;

    // Hash new password if provided
    if (password) {
      if (password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update name if name components changed
    if (firstName || middleName !== undefined || lastName || nameExtension !== undefined) {
      const newFirstName = firstName || user.firstName;
      const newMiddleName = middleName !== undefined ? middleName : user.middleName;
      const newLastName = lastName || user.lastName;
      const newNameExtension = nameExtension !== undefined ? nameExtension : user.nameExtension;
      
      updateData.name = `${newFirstName} ${newMiddleName ? newMiddleName + ' ' : ''}${newLastName}${newNameExtension ? ' ' + newNameExtension : ''}`;
    }

    await this.usersRepository.update(id, updateData);
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

    const usersByRole = roleStats.map(stat => ({
      roleName: stat.roleName || 'No Role',
      count: parseInt(stat.count),
    }));

    // Get recent users (last 10)
    const recentUsers = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['defaultRole', 'roles'],
    });

    const sanitizedRecentUsers = recentUsers.map(user => {
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
}