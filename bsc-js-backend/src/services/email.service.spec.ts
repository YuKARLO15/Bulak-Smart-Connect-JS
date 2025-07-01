import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

// Mock nodemailer
const mockTransporter = {
  sendMail: jest.fn(),
};

jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => mockTransporter),
}));

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mocks
    jest.clearAllMocks();

    // Setup default config values
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'SMTP_HOST':
          return 'smtp.gmail.com';
        case 'SMTP_PORT':
          return '587';
        case 'SMTP_SECURE':
          return 'false';
        case 'SMTP_USER':
          return 'test@gmail.com';
        case 'SMTP_PASS':
          return 'test-password';
        case 'EMAIL_FROM':
          return 'noreply@bulaksmartconnect.com';
        default:
          return '';
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendOTP', () => {
    it('should send verification email successfully', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'verification';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      const result = await service.sendOTP(email, otp, purpose);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@bulaksmartconnect.com',
        to: email,
        subject: '🔐 Bulak LGU Smart Connect - Email Verification',
        html: expect.stringContaining(otp),
      });
      expect(result).toEqual({ messageId: 'test-message-id' });
    });

    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'password_reset';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      const result = await service.sendOTP(email, otp, purpose);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@bulaksmartconnect.com',
        to: email,
        subject: '🔒 Bulak LGU Smart Connect - Password Reset',
        html: expect.stringContaining(otp),
      });
      expect(result).toEqual({ messageId: 'test-message-id' });
    });

    it('should fallback to verification template for unknown purpose', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'unknown_purpose';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      const result = await service.sendOTP(email, otp, purpose);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@bulaksmartconnect.com',
        to: email,
        subject: '🔐 Bulak LGU Smart Connect - Email Verification',
        html: expect.stringContaining(otp),
      });
      expect(result).toEqual({ messageId: 'test-message-id' });
    });

    it('should handle email sending failure', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'verification';

      mockTransporter.sendMail.mockRejectedValue(
        new Error('SMTP connection failed'),
      );

      await expect(service.sendOTP(email, otp, purpose)).rejects.toThrow(
        'SMTP connection failed',
      );
    });

    it('should include OTP in email content', async () => {
      const email = 'test@example.com';
      const otp = '987654';
      const purpose = 'verification';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendOTP(email, otp, purpose);

      const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];
      expect(sendMailCall.html).toContain(otp);
      expect(sendMailCall.html).toContain('Bulak LGU Smart Connect');
    });
  });

  describe('sendApplicationNotification', () => {
    it('should send application notification with correct status color', async () => {
      const email = 'test@example.com';
      const applicationId = 'APP-001';
      const status = 'Approved';
      const applicationType = 'Business Permit';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      const result = await service.sendApplicationNotification(
        email,
        applicationId,
        status,
        applicationType,
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@bulaksmartconnect.com',
        to: email,
        subject: `📋 Application ${applicationId} - Status: ${status}`,
        html: expect.stringContaining('#27ae60'), // Green color for approved
      });
      expect(result).toEqual({ messageId: 'test-message-id' });
    });

    it('should handle different status colors correctly', async () => {
      const testCases = [
        { status: 'Pending', expectedColor: '#f39c12' },
        { status: 'Approved', expectedColor: '#27ae60' },
        { status: 'Rejected', expectedColor: '#e74c3c' },
        { status: 'Ready for Pickup', expectedColor: '#3498db' },
      ];

      for (const testCase of testCases) {
        mockTransporter.sendMail.mockClear();
        mockTransporter.sendMail.mockResolvedValue({
          messageId: 'test-message-id',
        });

        await service.sendApplicationNotification(
          'test@example.com',
          'APP-001',
          testCase.status,
          'Document Application',
        );

        const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];
        expect(sendMailCall.html).toContain(testCase.expectedColor);
        expect(sendMailCall.html).toContain(testCase.status);
      }
    });

    it('should handle unknown status with default color', async () => {
      const email = 'test@example.com';
      const applicationId = 'APP-001';
      const status = 'Unknown Status';
      const applicationType = 'Business Permit';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendApplicationNotification(
        email,
        applicationId,
        status,
        applicationType,
      );

      const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];
      expect(sendMailCall.html).toContain('#333'); // Default color
      expect(sendMailCall.html).toContain(status);
    });

    it('should include all application details in email', async () => {
      const email = 'test@example.com';
      const applicationId = 'APP-123';
      const status = 'Approved';
      const applicationType = 'Birth Certificate';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendApplicationNotification(
        email,
        applicationId,
        status,
        applicationType,
      );

      const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];
      expect(sendMailCall.html).toContain(applicationId);
      expect(sendMailCall.html).toContain(status);
      expect(sendMailCall.html).toContain(applicationType);
      expect(sendMailCall.subject).toContain(applicationId);
      expect(sendMailCall.subject).toContain(status);
    });

    it('should handle notification sending failure', async () => {
      const email = 'test@example.com';
      const applicationId = 'APP-001';
      const status = 'Approved';
      const applicationType = 'Business Permit';

      mockTransporter.sendMail.mockRejectedValue(new Error('Network timeout'));

      await expect(
        service.sendApplicationNotification(
          email,
          applicationId,
          status,
          applicationType,
        ),
      ).rejects.toThrow('Network timeout');
    });
  });

  describe('configuration handling', () => {
    it('should handle missing SMTP configuration', () => {
      mockConfigService.get.mockReturnValue(undefined);

      // Should not throw during service creation
      expect(() => {
        new EmailService(configService);
      }).not.toThrow();
    });

    it('should use secure connection when configured', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'SMTP_SECURE') return 'true';
        return mockConfigService.get(key);
      });

      // This tests the constructor logic
      const newService = new EmailService(configService);
      expect(newService).toBeDefined();
    });
  });
});
