import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OTPService } from '../services/otp.service';
import { EmailService } from '../services/email.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let otpService: OTPService;
  let emailService: EmailService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
    updateUserInfo: jest.fn(),
    adminUpdateUser: jest.fn(),
    findUserByEmail: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockOTPService = {
    generateOTP: jest.fn(),
    verifyOTP: jest.fn(),
    cleanupExpiredOTPs: jest.fn(),
  };

  const mockEmailService = {
    sendOTP: jest.fn(),
    sendApplicationNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: OTPService,
          useValue: mockOTPService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    otpService = module.get<OTPService>(OTPService);
    emailService = module.get<EmailService>(EmailService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        access_token: 'jwt-token',
        user: { id: 1, email: 'test@example.com', roles: ['citizen'] },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register user successfully with OTP verification', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        otp: '123456',
      };

      const expectedResult = {
        access_token: 'jwt-token',
        user: { id: 1, email: 'test@example.com', roles: ['citizen'] },
      };

      mockOTPService.verifyOTP.mockResolvedValue(true);
      mockAuthService.register.mockResolvedValue(expectedResult);
      mockEmailService.sendApplicationNotification.mockResolvedValue(true);

      const result = await controller.register(registerDto);

      expect(mockOTPService.verifyOTP).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'verification',
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockEmailService.sendApplicationNotification).toHaveBeenCalledWith(
        'test@example.com',
        'Welcome!',
        'Account Created',
        'Welcome to Bulak LGU Smart Connect',
      );
      expect(result).toEqual(expectedResult);
    });

    it('should register user successfully without OTP', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const expectedResult = {
        access_token: 'jwt-token',
        user: { id: 1, email: 'test@example.com', roles: ['citizen'] },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);
      mockEmailService.sendApplicationNotification.mockResolvedValue(true);

      const result = await controller.register(registerDto);

      expect(mockOTPService.verifyOTP).not.toHaveBeenCalled();
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException for invalid OTP', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        otp: '000000',
      };

      mockOTPService.verifyOTP.mockResolvedValue(false);

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe('sendOTP', () => {
    it('should send OTP successfully', async () => {
      const sendOtpDto = { email: 'test@example.com', purpose: 'verification' };

      mockOTPService.generateOTP.mockResolvedValue('123456');

      const result = await controller.sendOTP(sendOtpDto);

      expect(mockOTPService.generateOTP).toHaveBeenCalledWith(
        'test@example.com',
        'verification',
      );
      expect(result).toEqual({
        success: true,
        message: 'OTP sent successfully',
        email: 'test@example.com',
      });
    });

    it('should use default purpose when not provided', async () => {
      const sendOtpDto = { email: 'test@example.com' };

      mockOTPService.generateOTP.mockResolvedValue('123456');

      const result = await controller.sendOTP(sendOtpDto);

      expect(mockOTPService.generateOTP).toHaveBeenCalledWith(
        'test@example.com',
        'verification',
      );
      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException for invalid email', async () => {
      const sendOtpDto = { email: 'invalid-email', purpose: 'verification' };

      await expect(controller.sendOTP(sendOtpDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockOTPService.generateOTP).not.toHaveBeenCalled();
    });

    it('should handle OTP service errors', async () => {
      const sendOtpDto = { email: 'test@example.com', purpose: 'verification' };

      mockOTPService.generateOTP.mockRejectedValue(
        new Error('Email service failed'),
      );

      await expect(controller.sendOTP(sendOtpDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP successfully', async () => {
      const verifyOtpDto = {
        email: 'test@example.com',
        otp: '123456',
        purpose: 'verification',
      };

      mockOTPService.verifyOTP.mockResolvedValue(true);

      const result = await controller.verifyOTP(verifyOtpDto);

      expect(mockOTPService.verifyOTP).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'verification',
      );
      expect(result).toEqual({
        success: true,
        message: 'OTP verified successfully',
      });
    });

    it('should use default purpose when not provided', async () => {
      const verifyOtpDto = { email: 'test@example.com', otp: '123456' };

      mockOTPService.verifyOTP.mockResolvedValue(true);

      await controller.verifyOTP(verifyOtpDto);

      expect(mockOTPService.verifyOTP).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'verification',
      );
    });

    it('should throw UnauthorizedException for invalid OTP', async () => {
      const verifyOtpDto = {
        email: 'test@example.com',
        otp: '000000',
        purpose: 'verification',
      };

      mockOTPService.verifyOTP.mockResolvedValue(false);

      await expect(controller.verifyOTP(verifyOtpDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle OTP service errors', async () => {
      const verifyOtpDto = {
        email: 'test@example.com',
        otp: '123456',
        purpose: 'verification',
      };

      mockOTPService.verifyOTP.mockRejectedValue(new Error('Database error'));

      await expect(controller.verifyOTP(verifyOtpDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset code for existing user', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 1, email: 'test@example.com' };

      mockAuthService.findUserByEmail.mockResolvedValue(mockUser);
      mockOTPService.generateOTP.mockResolvedValue('123456');

      const result = await controller.forgotPassword({ email });

      expect(mockAuthService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockOTPService.generateOTP).toHaveBeenCalledWith(
        email,
        'password_reset',
      );
      expect(result).toEqual({
        success: true,
        message: 'Password reset code sent to your email',
      });
    });

    it('should not reveal if email does not exist', async () => {
      const email = 'nonexistent@example.com';

      mockAuthService.findUserByEmail.mockResolvedValue(null);

      const result = await controller.forgotPassword({ email });

      expect(mockAuthService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockOTPService.generateOTP).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message:
          'If this email is registered, you will receive a password reset code',
      });
    });

    it('should handle OTP generation errors', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 1, email: 'test@example.com' };

      mockAuthService.findUserByEmail.mockResolvedValue(mockUser);
      mockOTPService.generateOTP.mockRejectedValue(
        new Error('Email service failed'),
      );

      await expect(controller.forgotPassword({ email })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetDto = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'NewPassword123!',
      };

      mockOTPService.verifyOTP.mockResolvedValue(true);
      mockAuthService.updatePassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword(resetDto);

      expect(mockOTPService.verifyOTP).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'password_reset',
      );
      expect(mockAuthService.updatePassword).toHaveBeenCalledWith(
        'test@example.com',
        'NewPassword123!',
      );
      expect(result).toEqual({
        success: true,
        message: 'Password reset successfully',
      });
    });

    it('should throw UnauthorizedException for invalid OTP', async () => {
      const resetDto = {
        email: 'test@example.com',
        otp: '000000',
        newPassword: 'NewPassword123!',
      };

      mockOTPService.verifyOTP.mockResolvedValue(false);

      await expect(controller.resetPassword(resetDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.updatePassword).not.toHaveBeenCalled();
    });

    it('should handle password update errors', async () => {
      const resetDto = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'weak',
      };

      mockOTPService.verifyOTP.mockResolvedValue(true);
      mockAuthService.updatePassword.mockRejectedValue(
        new BadRequestException('Password too weak'),
      );

      await expect(controller.resetPassword(resetDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('testOTP', () => {
    beforeEach(() => {
      // Mock environment variable
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      delete process.env.NODE_ENV;
    });

    it('should generate test OTP in development mode', async () => {
      const email = 'test@example.com';

      mockOTPService.generateOTP.mockResolvedValue('123456');

      const result = await controller.testOTP({ email });

      expect(mockOTPService.generateOTP).toHaveBeenCalledWith(
        email,
        'verification',
      );
      expect(result).toEqual({
        success: true,
        message: 'OTP generated and sent',
        otp: '123456',
      });
    });

    it('should not return OTP in production mode', async () => {
      process.env.NODE_ENV = 'production';
      const email = 'test@example.com';

      mockOTPService.generateOTP.mockResolvedValue('123456');

      const result = await controller.testOTP({ email });

      expect(result).toEqual({
        success: true,
        message: 'OTP generated and sent',
        otp: undefined,
      });
    });

    it('should handle OTP generation errors', async () => {
      const email = 'test@example.com';

      mockOTPService.generateOTP.mockRejectedValue(
        new Error('Service unavailable'),
      );

      await expect(controller.testOTP({ email })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockRequest = {
        user: { id: 1, email: 'test@example.com' },
      } as any;

      const expectedProfile = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      mockAuthService.getProfile.mockResolvedValue(expectedProfile);

      const result = await controller.getProfile(mockRequest);

      expect(mockAuthService.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedProfile);
    });

    it('should throw UnauthorizedException for invalid user ID', async () => {
      const mockRequest = {
        user: { id: null },
      } as any;

      await expect(controller.getProfile(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.getProfile).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockRequest = {
        user: { id: 1, email: 'test@example.com' },
      } as any;

      const updateDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const expectedResult = { success: true, message: 'Profile updated' };

      mockAuthService.updateUserInfo.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(mockAuthService.updateUserInfo).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException for invalid user ID', async () => {
      const mockRequest = {
        user: { id: undefined },
      } as any;

      const updateDto = { firstName: 'Updated' };

      await expect(
        controller.updateProfile(mockRequest, updateDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.updateUserInfo).not.toHaveBeenCalled();
    });
  });
});
