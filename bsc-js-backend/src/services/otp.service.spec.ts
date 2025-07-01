import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OTPService } from './otp.service';
import { EmailService } from './email.service';
import { OTP } from '../entities/otp.entity';

describe('OTPService', () => {
  let service: OTPService;
  let otpRepository: Repository<OTP>;
  let emailService: EmailService;
  let configService: ConfigService;

  const mockOtpRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockEmailService = {
    sendOTP: jest.fn(),
    sendApplicationNotification: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OTPService,
        {
          provide: getRepositoryToken(OTP),
          useValue: mockOtpRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<OTPService>(OTPService);
    otpRepository = module.get<Repository<OTP>>(getRepositoryToken(OTP));
    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateOTP', () => {
    beforeEach(() => {
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'OTP_LENGTH':
            return '6';
          case 'OTP_EXPIRY_MINUTES':
            return '5';
          case 'OTP_SECRET':
            return 'test-secret-key-for-testing-purposes';
          default:
            return '';
        }
      });
    });

    it('should generate and save OTP successfully', async () => {
      const email = 'test@example.com';
      const purpose = 'verification';
      
      const mockOtpEntity = {
        id: 1,
        email,
        otp: '123456',
        purpose,
        verified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdAt: new Date(),
      };

      mockOtpRepository.update.mockResolvedValue({ affected: 1 });
      mockOtpRepository.create.mockReturnValue(mockOtpEntity);
      mockOtpRepository.save.mockResolvedValue(mockOtpEntity);
      mockEmailService.sendOTP.mockResolvedValue(true);

      const result = await service.generateOTP(email, purpose);

      expect(mockOtpRepository.update).toHaveBeenCalledWith(
        { email, purpose, verified: false },
        { verified: true }
      );
      expect(mockOtpRepository.create).toHaveBeenCalled();
      expect(mockOtpRepository.save).toHaveBeenCalledWith(mockOtpEntity);
      expect(mockEmailService.sendOTP).toHaveBeenCalledWith(email, expect.any(String), purpose);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toHaveLength(6);
    });

    it('should handle email service failure gracefully', async () => {
      const email = 'test@example.com';
      const purpose = 'verification';

      mockOtpRepository.update.mockResolvedValue({ affected: 0 });
      mockOtpRepository.create.mockReturnValue({});
      mockOtpRepository.save.mockResolvedValue({});
      mockEmailService.sendOTP.mockRejectedValue(new Error('Email service failed'));

      await expect(service.generateOTP(email, purpose)).rejects.toThrow('Email service failed');
    });

    it('should generate OTP with default purpose', async () => {
      const email = 'test@example.com';

      mockOtpRepository.update.mockResolvedValue({ affected: 0 });
      mockOtpRepository.create.mockReturnValue({});
      mockOtpRepository.save.mockResolvedValue({});
      mockEmailService.sendOTP.mockResolvedValue(true);

      await service.generateOTP(email);

      expect(mockEmailService.sendOTP).toHaveBeenCalledWith(email, expect.any(String), 'verification');
    });
  });

  describe('verifyOTP', () => {
    it('should verify valid OTP successfully', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'verification';

      const mockOtpEntity = {
        id: 1,
        email,
        otp,
        purpose,
        verified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        createdAt: new Date(),
      };

      mockOtpRepository.findOne.mockResolvedValue(mockOtpEntity);
      mockOtpRepository.save.mockResolvedValue({ ...mockOtpEntity, verified: true });

      const result = await service.verifyOTP(email, otp, purpose);

      expect(mockOtpRepository.findOne).toHaveBeenCalledWith({
        where: { email, otp, purpose, verified: false }
      });
      expect(mockOtpRepository.save).toHaveBeenCalledWith({ ...mockOtpEntity, verified: true });
      expect(result).toBe(true);
    });

    it('should reject invalid OTP', async () => {
      const email = 'test@example.com';
      const otp = '999999';
      const purpose = 'verification';

      mockOtpRepository.findOne.mockResolvedValue(null);

      const result = await service.verifyOTP(email, otp, purpose);

      expect(mockOtpRepository.findOne).toHaveBeenCalledWith({
        where: { email, otp, purpose, verified: false }
      });
      expect(result).toBe(false);
    });

    it('should reject expired OTP', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'verification';

      const mockOtpEntity = {
        id: 1,
        email,
        otp,
        purpose,
        verified: false,
        expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
        createdAt: new Date(),
      };

      mockOtpRepository.findOne.mockResolvedValue(mockOtpEntity);

      const result = await service.verifyOTP(email, otp, purpose);

      expect(result).toBe(false);
      expect(mockOtpRepository.save).not.toHaveBeenCalled();
    });

    it('should verify OTP with default purpose', async () => {
      const email = 'test@example.com';
      const otp = '123456';

      const mockOtpEntity = {
        id: 1,
        email,
        otp,
        purpose: 'verification',
        verified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdAt: new Date(),
      };

      mockOtpRepository.findOne.mockResolvedValue(mockOtpEntity);
      mockOtpRepository.save.mockResolvedValue({ ...mockOtpEntity, verified: true });

      const result = await service.verifyOTP(email, otp);

      expect(mockOtpRepository.findOne).toHaveBeenCalledWith({
        where: { email, otp, purpose: 'verification', verified: false }
      });
      expect(result).toBe(true);
    });
  });

  describe('cleanupExpiredOTPs', () => {
    it('should delete expired OTPs', async () => {
      mockOtpRepository.delete.mockResolvedValue({ affected: 5 });

      await service.cleanupExpiredOTPs();

      expect(mockOtpRepository.delete).toHaveBeenCalledWith({
        expiresAt: expect.any(Object) // LessThan(new Date())
      });
    });

    it('should handle cleanup errors gracefully', async () => {
      mockOtpRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.cleanupExpiredOTPs()).rejects.toThrow('Database error');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle database connection errors during OTP generation', async () => {
      const email = 'test@example.com';
      const purpose = 'verification';

      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'OTP_LENGTH':
            return '6';
          case 'OTP_EXPIRY_MINUTES':
            return '5';
          case 'OTP_SECRET':
            return 'test-secret';
          default:
            return '';
        }
      });

      mockOtpRepository.update.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.generateOTP(email, purpose)).rejects.toThrow('Database connection failed');
    });

    it('should handle missing configuration values', async () => {
      const email = 'test@example.com';
      const purpose = 'verification';

      mockConfigService.get.mockReturnValue(undefined);

      // Should handle missing config gracefully with defaults
      mockOtpRepository.update.mockResolvedValue({ affected: 0 });
      mockOtpRepository.create.mockReturnValue({});
      mockOtpRepository.save.mockResolvedValue({});
      mockEmailService.sendOTP.mockResolvedValue(true);

      const result = await service.generateOTP(email, purpose);
      expect(result).toBeDefined();
    });
  });
});