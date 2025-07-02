import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { AuthenticatedUser } from './jwt.strategy';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { OTPService } from '../services/otp.service';
import { EmailService } from '../services/email.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  TestOtpDto,
  ApplicationNotificationDto,
} from './dto/otp.dto';
import { QueueNotificationDto } from './dto/queue-notification.dto';
import { AppointmentNotificationDto } from './dto/appointment-notification.dto';

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@ApiTags('Authentication & OTP')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService,
    private emailService: EmailService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            username: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            defaultRole: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Login request received:', loginDto);
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Invalid credentials',
      );
    }
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            username: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            defaultRole: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or username already exists',
  })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    try {
      // First verify OTP if email verification is enabled
      if (createUserDto.email && createUserDto.otp) {
        const isOtpValid = await this.otpService.verifyOTP(
          createUserDto.email,
          createUserDto.otp,
          'verification',
        );

        if (!isOtpValid) {
          throw new BadRequestException('Invalid or expired OTP');
        }
      }

      const result = await this.authService.register(createUserDto);

      // Send welcome email
      if (createUserDto.email) {
        await this.emailService.sendApplicationNotification(
          createUserDto.email,
          'Welcome!',
          'Account Created',
          'Welcome to Bulak LGU Smart Connect',
        );
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // Add null check before converting to number
    if (!req.user || req.user.id === undefined || req.user.id === null) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return this.authService.getProfile(Number(req.user.id));
  }
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Allows a user to update their own profile information',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or username already exists',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Add null check before converting to number
    if (!req.user || req.user.id === undefined || req.user.id === null) {
      throw new UnauthorizedException('Invalid user ID');
    }

    try {
      return await this.authService.updateUserInfo(
        Number(req.user.id),
        updateUserDto,
      );
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    }
  }
  @ApiOperation({
    summary: 'Admin update user',
    description:
      "Allows administrators to update any user's information including role assignments",
  })
  @ApiParam({ name: 'userId', description: 'ID of the user to update' })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - user or role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or username already exists',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('admin/update-user/:userId')
  @UseGuards(JwtAuthGuard) // Make sure this guard is working
  async adminUpdateUser(
    @Request() req: RequestWithUser,
    @Param('userId') targetUserId: string,
    @Body() updateUserDto: AdminUpdateUserDto,
  ) {
    // Add logging to see what's happening
    console.log('🔍 Admin update request received:');
    console.log('Admin ID:', req.user?.id);
    console.log('Admin roles:', req.user?.roles);
    console.log('Target User ID:', targetUserId);
    console.log('Update data:', updateUserDto);

    if (!req.user || req.user.id === undefined || req.user.id === null) {
      console.error('❌ No user in request object');
      throw new UnauthorizedException('Invalid admin ID');
    }

    try {
      return await this.authService.adminUpdateUser(
        Number(req.user.id),
        Number(targetUserId),
        updateUserDto,
      );
    } catch (error) {
      console.error('❌ Admin update error:', error);
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Failed to update user',
      );
    }
  }

  @ApiOperation({
    summary: 'Send OTP for email verification or password reset',
    description: `
    Generates and sends a 6-digit OTP code to the specified email address.
    
    **Use Cases:**
    - Email verification during registration
    - Password reset verification
    - Two-factor authentication
    
    **Security Features:**
    - OTP expires after 5 minutes
    - Previous OTPs are invalidated when new one is generated
    - Rate limiting to prevent spam
    
    **Email Templates:**
    - Verification: Blue gradient professional template
    - Password Reset: Red themed security alert template
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'OTP sent successfully' },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid email format or missing fields',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid email format' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBody({
    description: 'Email and purpose for OTP generation',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Email address to send OTP to',
        },
        purpose: {
          type: 'string',
          enum: ['verification', 'password_reset'],
          example: 'verification',
          description: 'Purpose of the OTP',
          default: 'verification',
        },
      },
      required: ['email'],
    },
  })
  @Post('send-otp')
  async sendOTP(@Body() sendOtpDto: { email: string; purpose?: string }) {
    try {
      const { email, purpose = 'verification' } = sendOtpDto;

      // Validate email format
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new BadRequestException('Invalid email format');
      }

      await this.otpService.generateOTP(email, purpose);

      return {
        success: true,
        message: 'OTP sent successfully',
        email: email,
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new BadRequestException('Failed to send OTP');
    }
  }

  @ApiOperation({
    summary: 'Verify OTP code',
    description: `
    Verifies a 6-digit OTP code against the email and purpose.
    
    **Verification Process:**
    1. Checks if OTP exists and is not expired
    2. Validates the code matches
    3. Marks OTP as verified (single-use)
    4. Returns verification status
    
    **Security Features:**
    - Single-use OTPs (marked as verified after use)
    - Time-based expiration (5 minutes)
    - Purpose isolation (verification vs password_reset)
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'OTP verified successfully' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired OTP',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid or expired OTP' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBody({
    description: 'Email, OTP code, and purpose for verification',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Email address',
        },
        otp: {
          type: 'string',
          example: '123456',
          pattern: '^[0-9]{6}$',
          description: '6-digit OTP code',
        },
        purpose: {
          type: 'string',
          enum: ['verification', 'password_reset'],
          example: 'verification',
          description: 'Purpose of the OTP verification',
          default: 'verification',
        },
      },
      required: ['email', 'otp'],
    },
  })
  @Post('verify-otp')
  async verifyOTP(
    @Body() verifyOtpDto: { email: string; otp: string; purpose?: string },
  ) {
    try {
      const { email, otp, purpose = 'verification' } = verifyOtpDto;

      const isValid = await this.otpService.verifyOTP(email, otp, purpose);

      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new UnauthorizedException('Invalid or expired OTP');
    }
  }

  // Add password reset endpoints
  @ApiOperation({
    summary: 'Request password reset OTP',
    description: `
    Initiates password reset process by sending OTP to registered email.
    
    **Security Features:**
    - Does not reveal if email exists (security best practice)
    - Generates secure 6-digit OTP
    - Uses dedicated password reset email template
    - OTP expires after 5 minutes
    
    **Process:**
    1. Validates email format
    2. Checks if user exists (internally)
    3. Generates OTP for password_reset purpose
    4. Sends formatted email with reset instructions
    5. Returns success message regardless of email existence
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset process initiated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example:
            'If this email is registered, you will receive a password reset code',
        },
      },
    },
  })
  @ApiBody({
    description: 'Email address for password reset',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Registered email address',
        },
      },
      required: ['email'],
    },
  })
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    try {
      // Check if user exists
      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message:
            'If this email is registered, you will receive a password reset code',
        };
      }

      await this.otpService.generateOTP(email, 'password_reset');

      return {
        success: true,
        message: 'Password reset code sent to your email',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new BadRequestException('Failed to send password reset code');
    }
  }

  @ApiOperation({
    summary: 'Reset password with OTP verification',
    description: `
    Completes password reset process using OTP verification.
    
    **Process:**
    1. Verifies OTP code is valid and not expired
    2. Validates new password meets complexity requirements
    3. Updates user password with secure hashing
    4. Marks OTP as used
    
    **Password Requirements:**
    - Minimum 8 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter  
    - At least 1 number
    - At least 1 special character (@$!%*?&)
    
    **Security Features:**
    - bcrypt password hashing
    - OTP single-use enforcement
    - Password strength validation
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Password reset successfully' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired reset code',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid or expired reset code' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBody({
    description: 'Email, OTP, and new password for reset',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Email address',
        },
        otp: {
          type: 'string',
          example: '123456',
          pattern: '^[0-9]{6}$',
          description: '6-digit OTP code received via email',
        },
        newPassword: {
          type: 'string',
          example: 'NewSecure123!',
          minLength: 8,
          pattern:
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
          description: 'New password (must meet complexity requirements)',
        },
      },
      required: ['email', 'otp', 'newPassword'],
    },
  })
  @Post('reset-password')
  async resetPassword(
    @Body() resetDto: { email: string; otp: string; newPassword: string },
  ) {
    try {
      const { email, otp, newPassword } = resetDto;

      // Verify OTP
      const isOtpValid = await this.otpService.verifyOTP(
        email,
        otp,
        'password_reset',
      );
      if (!isOtpValid) {
        throw new UnauthorizedException('Invalid or expired reset code');
      }

      // Update password
      await this.authService.updatePassword(email, newPassword);

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Test OTP generation (Development Only)',
    description: `
    **⚠️ DEVELOPMENT ONLY - Disabled in Production**
    
    Generates test OTP and optionally returns the code for testing purposes.
    
    **Usage:**
    - Frontend testing and debugging
    - Integration testing
    - Email service verification
    
    **Security:**
    - Only available when NODE_ENV=development
    - Returns OTP code in response for testing
    - Disabled automatically in production
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Test OTP generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'OTP generated and sent' },
        otp: {
          type: 'string',
          example: '123456',
          description: 'OTP code (only in development mode)',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not available in production',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: {
          type: 'string',
          example: 'Test endpoints not available in production',
        },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiBody({
    description: 'Email address for testing OTP generation',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'test@example.com',
          description: 'Email address for testing OTP generation',
        },
      },
      required: ['email'],
    },
  })
  @Post('test-otp')
  async testOTP(@Body() { email }: { email: string }) {
    // Add environment check to your existing implementation
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException(
        'Test endpoints not available in production',
      );
    }

    try {
      const otp = await this.otpService.generateOTP(email, 'verification');
      return {
        success: true,
        message: 'OTP generated and sent',
        // Remove this in production - only for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      };
    } catch (error) {
      console.error('Test OTP error:', error);
      throw new BadRequestException('Failed to generate OTP');
    }
  }

  @ApiOperation({
    summary: 'Send application status notification',
    description: `
    Sends formatted email notification for application status updates.
    
    **Supported Statuses:**
    - Pending (Orange theme)
    - Approved (Green theme)
    - Rejected (Red theme)
    - Ready for Pickup (Blue theme)
    
    **Email Features:**
    - Professional branded templates
    - Status-specific color coding
    - Application details included
    - Responsive design
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Application notification sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Application notification sent successfully',
        },
      },
    },
  })
  @ApiBody({
    description: 'Application notification details',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Recipient email address',
        },
        applicationId: {
          type: 'string',
          example: 'APP-001',
          description: 'Application ID',
        },
        status: {
          type: 'string',
          enum: ['Pending', 'Approved', 'Rejected', 'Ready for Pickup'],
          example: 'Approved',
          description: 'Application status',
        },
        applicationType: {
          type: 'string',
          example: 'Birth Certificate',
          description: 'Type of application',
        },
      },
      required: ['email', 'applicationId', 'status', 'applicationType'],
    },
  })
  @Post('send-application-notification')
  async sendApplicationNotification(
    @Body()
    notificationDto: {
      email: string;
      applicationId: string;
      status: string;
      applicationType: string;
    },
  ) {
    try {
      const { email, applicationId, status, applicationType } = notificationDto;

      await this.emailService.sendApplicationNotification(
        email,
        applicationId,
        status,
        applicationType,
      );

      return {
        success: true,
        message: 'Application notification sent successfully',
      };
    } catch (error) {
      console.error('Error sending application notification:', error);
      throw new BadRequestException('Failed to send application notification');
    }
  }

  @ApiOperation({
    summary: 'Send queue notification',
    description: 'Send email notification for queue position or status updates',
  })
  @Post('send-queue-notification')
  async sendQueueNotification(@Body() notificationDto: QueueNotificationDto) {
    try {
      const { email, queueNumber, type, position, estimatedTime, status, message } = notificationDto;

      if (type === 'position_alert') {
        // Fix: Ensure position is defined for position alerts
        if (position === undefined) {
          throw new BadRequestException('Position is required for position alerts');
        }
        
        await this.emailService.sendQueuePositionAlert(
          email,
          queueNumber,
          position, // Now guaranteed to be a number
          estimatedTime || '10 minutes', // Provide default if undefined
        );
      } else if (type === 'status_update') {
        await this.emailService.sendQueueStatusUpdate(
          email,
          queueNumber,
          status || 'now_serving', // Provide default if undefined
          message || 'Please proceed to the counter',
        );
      }

      return {
        success: true,
        message: 'Queue notification sent successfully',
      };
    } catch (error) {
      // Don't throw error to avoid breaking queue functionality
      console.error('Queue notification error:', error);
      return {
        success: false,
        message: 'Failed to send notification, but queue operation continues',
      };
    }
  }

  @ApiOperation({
    summary: 'Send appointment confirmation notification',
    description: 'Send email notification when appointment is confirmed',
  })
  @ApiBody({ type: AppointmentNotificationDto })
  @Post('notifications/appointment-confirmation')
  async sendAppointmentConfirmation(
    @Body() notificationDto: AppointmentNotificationDto,
  ) {
    try {
      const { email, appointmentNumber, appointmentDetails } = notificationDto;

      await this.emailService.sendAppointmentConfirmation(
        email,
        appointmentNumber,
        appointmentDetails,
      );

      return {
        success: true,
        message: 'Appointment confirmation sent successfully',
      };
    } catch (error) {
      console.error('Error sending appointment confirmation:', error);
      throw new BadRequestException('Failed to send appointment confirmation');
    }
  }

  @ApiOperation({
    summary: 'Send appointment status update notification',
    description: 'Send email notification when appointment status changes',
  })
  @ApiBody({ type: AppointmentNotificationDto })
  @Post('notifications/appointment-status-update')
  async sendAppointmentStatusUpdate(
    @Body() notificationDto: AppointmentNotificationDto,
  ) {
    try {
      const { email, appointmentNumber, status, appointmentDetails } = notificationDto;

      // Ensure status is provided for status updates
      if (!status) {
        throw new BadRequestException('Status is required for status updates');
      }

      await this.emailService.sendAppointmentStatusUpdate(
        email,
        appointmentNumber,
        status,
        appointmentDetails,
      );

      return {
        success: true,
        message: 'Appointment status update sent successfully',
      };
    } catch (error) {
      console.error('Error sending appointment status update:', error);
      throw new BadRequestException('Failed to send appointment status update');
    }
  }

  @ApiOperation({
    summary: 'Send appointment cancellation notification',
    description: 'Send email notification when appointment is cancelled',
  })
  @ApiBody({ type: AppointmentNotificationDto })
  @Post('notifications/appointment-cancellation')
  async sendAppointmentCancellation(
    @Body() notificationDto: AppointmentNotificationDto,
  ) {
    try {
      const { email, appointmentNumber, appointmentDetails, reason } = notificationDto;

      await this.emailService.sendAppointmentCancellation(
        email,
        appointmentNumber,
        appointmentDetails,
        reason,
      );

      return {
        success: true,
        message: 'Appointment cancellation sent successfully',
      };
    } catch (error) {
      console.error('Error sending appointment cancellation:', error);
      throw new BadRequestException('Failed to send appointment cancellation');
    }
  }

  @ApiOperation({
    summary: 'Send appointment reminder notification',
    description: 'Send email reminder 24 hours before appointment',
  })
  @ApiBody({ type: AppointmentNotificationDto })
  @Post('notifications/appointment-reminder')
  async sendAppointmentReminder(
    @Body() notificationDto: AppointmentNotificationDto,
  ) {
    try {
      const { email, appointmentNumber, appointmentDetails } = notificationDto;

      await this.emailService.sendAppointmentReminder(
        email,
        appointmentNumber,
        appointmentDetails,
      );

      return {
        success: true,
        message: 'Appointment reminder sent successfully',
      };
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      throw new BadRequestException('Failed to send appointment reminder');
    }
  }
}
