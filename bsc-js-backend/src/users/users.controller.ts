/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminUpdateUserDto } from '../auth/dto/update-user.dto'; // Import from auth module
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(
    @Query() query: UserQueryDto,

    @Request() req: { user: AuthenticatedUser },
  ) {
    const { page = 1, limit = 10, search, role } = query;
    return this.usersService.findAll({ page, limit, search, role });
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req: { user: AuthenticatedUser }) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    // Allow users to view their own profile
    const userId = +id;
    const currentUser = req.user;

    if (
      userId === currentUser.id ||
      currentUser.roles.some((role) =>
        ['admin', 'staff', 'super_admin'].includes(role.name),
      )
    ) {
      return this.usersService.findOne(userId);
    }

    throw new Error('Unauthorized');
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: AdminUpdateUserDto,

    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.usersService.adminUpdate(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id') id: string,

    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,

    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.usersService.updateStatus(+id, updateStatusDto.isActive);
  }

  @Post('admin-create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Admin creates user with role assignment' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async adminCreateUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Create user with hashed password
      const userWithHashedPassword = {
        ...createUserDto,
        password: hashedPassword,
      };

      const user = await this.usersService.create(userWithHashedPassword);

      // Return user without password

      const { password, ...userWithoutPassword } = user;

      // Get user with roles for response

      const userWithRoles = await this.usersService.findOne(user.id);

      return userWithRoles;
    } catch (error) {
      console.error('Error in admin create user:', error);
      throw error;
    }
  }
}
