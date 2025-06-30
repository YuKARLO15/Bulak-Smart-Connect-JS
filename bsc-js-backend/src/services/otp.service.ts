import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { OTP } from '../entities/otp.entity';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async generateOTP(email: string, purpose: string = 'verification'): Promise<string> {
    // Invalidate any existing OTPs for this email and purpose
    await this.otpRepository.update(
      { email, purpose, verified: false },
      { verified: true } // Mark as used
    );

    // Generate new OTP
    const otpLength = parseInt(this.configService.get('OTP_LENGTH', '6'));
    const otp = speakeasy.totp({
      secret: this.configService.get('OTP_SECRET') || 'default-secret-key',
      digits: otpLength,
      step: 300, // 5 minutes
      encoding: 'base32'
    });

    // Calculate expiry time
    const expiryMinutes = parseInt(this.configService.get('OTP_EXPIRY_MINUTES', '5'));
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    // Save OTP to database
    const otpEntity = this.otpRepository.create({
      email,
      otp,
      purpose,
      expiresAt,
      verified: false
    });

    await this.otpRepository.save(otpEntity);

    // Send email
    await this.emailService.sendOTP(email, otp, purpose);

    return otp; // Only return for testing purposes
  }

  async verifyOTP(email: string, otp: string, purpose: string = 'verification'): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: {
        email,
        otp,
        purpose,
        verified: false
      }
    });

    if (!otpEntity) {
      return false;
    }

    // Check if expired
    if (new Date() > otpEntity.expiresAt) {
      return false;
    }

    // Mark as verified
    otpEntity.verified = true;
    await this.otpRepository.save(otpEntity);

    return true;
  }

  async cleanupExpiredOTPs(): Promise<void> {
    await this.otpRepository.delete({
      expiresAt: LessThan(new Date())
    });
  }
}