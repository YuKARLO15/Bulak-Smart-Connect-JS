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
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';

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
        { username: loginDto.emailOrUsername },
      ],
    });
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __password, ...result } = user;
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
          { username: loginDto.emailOrUsername },
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __password, ...userWithoutPassword } = user;

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
    const {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      nameExtension,
      contactNumber,
    } = registerDto;

    // Generate full name
    const name = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}${nameExtension ? ' ' + nameExtension : ''}`;

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
    const passwordValidation = this.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.message);
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
        nameExtension,
        contactNumber,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __password, ...userWithoutPassword } = user;

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
    // Validation for userId
    if (!userId || isNaN(userId)) {
      throw new UnauthorizedException('Invalid user ID');
    }

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

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __password, ...result } = user;
    return {
      ...result,
      roles: roleNames,
      defaultRole: user.defaultRole?.name || 'citizen',
    };
  }

  async updateUserInfo(userId: number, updateUserDto: UpdateUserDto) {
    try {
      // First get the existing user
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if email is being updated and not already taken
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        // Validate email format
        if (!this.isValidEmail(updateUserDto.email)) {
          throw new BadRequestException('Invalid email format');
        }

        const existingUserByEmail = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUserByEmail && existingUserByEmail.id !== userId) {
          throw new ConflictException('Email already exists');
        }
      }

      // Check if username is being updated and not already taken
      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUserByUsername = await this.usersRepository.findOne({
          where: { username: updateUserDto.username },
        });

        if (existingUserByUsername && existingUserByUsername.id !== userId) {
          throw new ConflictException('Username already exists');
        }
      }

      // Handle password change if provided
      if (updateUserDto.password) {
        // Validate password strength
        const passwordValidation = this.validatePasswordStrength(updateUserDto.password);
        if (!passwordValidation.isValid) {
          throw new BadRequestException(passwordValidation.message);
        }

        // Hash new password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
        updateUserDto.password = hashedPassword;
      } else {
        // Remove password from DTO if not being updated
        delete updateUserDto.password;
      }

      // Update name if name parts are changed
      let shouldUpdateName = false;
      const nameComponents = {
        firstName: updateUserDto.firstName || user.firstName,
        middleName:
          updateUserDto.middleName !== undefined
            ? updateUserDto.middleName
            : user.middleName,
        lastName: updateUserDto.lastName || user.lastName,
        nameExtension:
          updateUserDto.nameExtension !== undefined
            ? updateUserDto.nameExtension
            : user.nameExtension,
      };

      if (
        updateUserDto.firstName ||
        updateUserDto.middleName !== undefined ||
        updateUserDto.lastName ||
        updateUserDto.nameExtension !== undefined
      ) {
        shouldUpdateName = true;
      }

      // Generate full name if any name component changed
      if (shouldUpdateName) {
        const fullName = `${nameComponents.firstName} ${
          nameComponents.middleName ? nameComponents.middleName + ' ' : ''
        }${nameComponents.lastName}${
          nameComponents.nameExtension ? ' ' + nameComponents.nameExtension : ''
        }`;
        updateUserDto['name'] = fullName;
      }

      try {
        // Update user with all provided fields
        await this.usersRepository.update(userId, updateUserDto);

        // Get updated user with relations
        const updatedUser = await this.usersRepository.findOne({
          where: { id: userId },
          relations: ['defaultRole'],
        });

        if (!updatedUser) {
          throw new BadRequestException('Failed to retrieve updated user');
        }

        // Get user roles
        const roles = await this.rolesService.getUserRoles(userId);
        const roleNames = roles.map((role) => role.name);

        // Remove password from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: __password, ...result } = updatedUser;

        return {
          ...result,
          roles: roleNames,
          defaultRole: updatedUser.defaultRole?.name || 'citizen',
        };
      } catch (error: unknown) {
        console.error('User update database error:', error);
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          error.code === 'ER_DUP_ENTRY'
        ) {
          throw new ConflictException('Email or username already exists');
        }
        throw new BadRequestException(
          'Failed to update user information in database',
        );
      }
    } catch (error) {
      console.error('User update error:', error);
      // Re-throw specific errors
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      // For any other unexpected error
      throw new BadRequestException('Failed to update user information');
    }
  }
  async adminUpdateUser(
    adminId: number,
    targetUserId: number,
    updateUserDto: AdminUpdateUserDto,
  ) {
    console.log(
      `Admin ${adminId} attempting to update user ${targetUserId}`,
      updateUserDto,
    );

    try {
      // Verify the admin has proper permissions
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      // Get admin roles
      const adminRoles = await this.rolesService.getUserRoles(adminId);
      const adminRoleNames = adminRoles.map((role) => role.name);

      // Check if the user has admin or super_admin role
      const isAuthorized = adminRoleNames.some(
        (role) => role === 'admin' || role === 'super_admin',
      );

      if (!isAuthorized) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Check if target user exists
      const targetUser = await this.usersRepository.findOne({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        throw new BadRequestException(`User with ID ${targetUserId} not found`);
      }

      // First perform the basic user update
      // We'll catch any errors here to handle them appropriately
      try {
        await this.updateUserInfo(targetUserId, updateUserDto);
      } catch (err) {
        console.error('Error during basic user update:', err);
        throw err; // Re-throw to be caught by outer try-catch
      }

      // Handle role updates if provided
      if (updateUserDto.roleIds && updateUserDto.roleIds.length > 0) {
        try {
          // Verify all roles exist before assigning
          for (const roleId of updateUserDto.roleIds) {
            try {
              await this.rolesService.findOne(roleId);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
              throw new BadRequestException(`Role with ID ${roleId} not found`);
            }
          }

          // Assign roles
          await this.rolesService.assignRolesToUser(
            targetUserId,
            updateUserDto.roleIds,
          );
          console.log(
            `Assigned roles ${updateUserDto.roleIds.join(', ')} to user ${targetUserId}`,
          );
        } catch (error) {
          console.error('Error assigning roles:', error);
          throw new BadRequestException(
            error instanceof Error ? error.message : 'Failed to assign roles',
          );
        }
      }

      // Update default role if provided
      if (updateUserDto.defaultRoleId) {
        try {
          // Verify the role exists
          try {
            await this.rolesService.findOne(updateUserDto.defaultRoleId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_) {
            throw new BadRequestException(
              `Default role with ID ${updateUserDto.defaultRoleId} not found`,
            );
          }

          // Verify user has this role assigned or will have it assigned
          const userRoles = await this.rolesService.getUserRoles(targetUserId);
          const hasRoleAssigned = userRoles.some(
            (role) => role.id === updateUserDto.defaultRoleId,
          );

          const willBeAssigned =
            updateUserDto.roleIds &&
            updateUserDto.roleIds.includes(updateUserDto.defaultRoleId);

          if (!hasRoleAssigned && !willBeAssigned) {
            throw new BadRequestException(
              'Cannot set default role to a role the user does not have',
            );
          }

          // Update the default role
          await this.usersRepository.update(targetUserId, {
            defaultRoleId: updateUserDto.defaultRoleId,
          });
          console.log(
            `Updated default role to ${updateUserDto.defaultRoleId} for user ${targetUserId}`,
          );
        } catch (error) {
          console.error('Error updating default role:', error);
          throw new BadRequestException(
            error instanceof Error
              ? error.message
              : 'Failed to update default role',
          );
        }
      }

      // Return the fully updated user
      try {
        const updatedUser = await this.getProfile(targetUserId);
        return updatedUser;
      } catch (error) {
        console.error('Error retrieving updated user profile:', error);
        throw new BadRequestException(
          'User was updated but profile could not be retrieved',
        );
      }
    } catch (error) {
      console.error('Admin update user error:', error);

      // Re-throw specific exceptions
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // For any other errors
      throw new BadRequestException(
        'Failed to update user: Unexpected error occurred',
      );
    }
  }

  // Add this method to find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['defaultRole'],
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Add this method to update password
  async updatePassword(email: string, newPassword: string): Promise<void> {
    try {
      // Validate password strength
      const passwordValidation = this.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw new BadRequestException(passwordValidation.message);
      }

      // Find user by email
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Hash new password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password in database
      await this.usersRepository.update(
        { id: user.id },
        { password: hashedPassword }
      );

      console.log(`Password updated successfully for user: ${email}`);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  private validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumbers) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!hasSpecialChars) {
      return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)' };
    }

    return { isValid: true };
  }
}
