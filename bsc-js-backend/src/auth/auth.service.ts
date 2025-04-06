import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
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
        where: { email: loginDto.email },
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

      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);
      console.log('Generated token:', token ? 'Success' : 'Failed');

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        access_token: token,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    
    // Validate password strength
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    
    await this.usersRepository.save(user);
    
    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}
