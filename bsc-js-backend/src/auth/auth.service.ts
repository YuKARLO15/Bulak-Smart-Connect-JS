import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [
        { email: loginDto.emailOrUsername },
        { username: loginDto.emailOrUsername }
      ],
    });
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    console.log('Login attempt with:', loginDto);

    try {
      const user = await this.usersRepository.findOne({
        where: [
          { email: loginDto.emailOrUsername },
          { username: loginDto.emailOrUsername }
        ],
        relations: ['defaultRole'],
      });

      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Debug password check
      console.log('Stored password hash:', user.password);
      console.log('Comparing with:', loginDto.password);

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Get user roles
      const roles = await this.rolesService.getUserRoles(user.id);
      const roleNames = roles.map((role) => role.name);

      const payload = {
        sub: user.id,
        email: user.email,
        roles: roleNames,
      };

      const token = this.jwtService.sign(payload);
      console.log('Generated token:', token ? 'Success' : 'Failed');

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        access_token: token,
        user: {
          ...userWithoutPassword,
          roles: roleNames,
          defaultRole: user.defaultRole?.name || 'citizen',
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, firstName, middleName, lastName } = registerDto;
    
    // Generate full name
    const name = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if user exists by email
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }
    
    // Check if username is taken
    if (username) {
      const existingUserByUsername = await this.usersRepository.findOne({
        where: { username },
      });
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Validate password strength
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Create new user with all fields
      const user = this.usersRepository.create({
        email,
        username,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        name,
      });

      await this.usersRepository.save(user);

      // Add citizen role to the user
      try {
        const citizenRole = await this.rolesService.findByName('citizen');
        await this.rolesService.assignRolesToUser(user.id, [citizenRole.id]);

        // Set default role
        user.defaultRoleId = citizenRole.id;
        await this.usersRepository.save(user);
      } catch (error) {
        console.error('Error assigning citizen role:', error);
        // Rollback: Delete the user to maintain a consistent state
        await this.usersRepository.delete(user.id);
        throw new ConflictException(
          'Failed to assign citizen role. Registration rolled back.',
        );
      }

      // Generate JWT token
      const payload = { sub: user.id, email: user.email, roles: ['citizen'] };

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          ...userWithoutPassword,
          roles: ['citizen'],
          defaultRole: 'citizen',
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['defaultRole'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get user roles
    const roles = await this.rolesService.getUserRoles(userId);
    const roleNames = roles.map((role) => role.name);

    const { password, ...result } = user;
    return {
      ...result,
      roles: roleNames,
      defaultRole: user.defaultRole?.name || 'citizen',
    };
  }
}
