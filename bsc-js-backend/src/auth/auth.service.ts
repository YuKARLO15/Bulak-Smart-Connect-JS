import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
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

    const { password: _, ...result } = user;
    return result;
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
