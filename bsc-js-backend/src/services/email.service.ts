import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendOTP(email: string, otp: string, purpose: string = 'verification') {
    const templates = {
      verification: {
        subject: '🔐 Bulak LGU Smart Connect - Email Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Email Verification Required</h2>
              <p style="font-size: 16px; color: #555;">
                Please use the following OTP to verify your email address:
              </p>
              <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; 
                          text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; 
                          letter-spacing: 8px;">${otp}</div>
              <p style="color: #777; font-size: 14px;">
                This OTP will expire in 5 minutes. If you didn't request this, please ignore this email.
              </p>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              © 2025 Bulak LGU Smart Connect. All rights reserved.
            </div>
          </div>
        `
      },
      password_reset: {
        subject: '🔒 Bulak LGU Smart Connect - Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p style="font-size: 16px; color: #555;">
                Use this OTP to reset your password:
              </p>
              <div style="background: #e74c3c; color: white; font-size: 32px; font-weight: bold; 
                          text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; 
                          letter-spacing: 8px;">${otp}</div>
              <p style="color: #777; font-size: 14px;">
                This OTP will expire in 5 minutes. If you didn't request this, please secure your account.
              </p>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              © 2025 Bulak LGU Smart Connect. All rights reserved.
            </div>
          </div>
        `
      },
      application_update: {
        subject: '📋 Bulak LGU Smart Connect - Application Status Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Application Status Update</h2>
              <p style="font-size: 16px; color: #555;">
                Your application status has been updated. Please check your dashboard for details.
              </p>
              <div style="background: #27ae60; color: white; font-size: 16px; font-weight: bold; 
                          text-align: center; padding: 15px; margin: 20px 0; border-radius: 8px;">
                Status: ${otp}
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              © 2025 Bulak LGU Smart Connect. All rights reserved.
            </div>
          </div>
        `
      }
    };

    const template = templates[purpose] || templates.verification;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: template.subject,
      html: template.html,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendApplicationNotification(email: string, applicationId: string, status: string, applicationType: string) {
    const statusColors = {
      'Pending': '#f39c12',
      'Approved': '#27ae60',
      'Rejected': '#e74c3c',
      'Ready for Pickup': '#3498db'
    };

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: `📋 Application ${applicationId} - Status: ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Application Status Update</h2>
            <p style="font-size: 16px; color: #555;">
              Your ${applicationType} application has been updated.
            </p>
            <div style="background: ${statusColors[status] || '#333'}; color: white; font-size: 18px; font-weight: bold; 
                        text-align: center; padding: 15px; margin: 20px 0; border-radius: 8px;">
              Application ID: ${applicationId}<br>
              Status: ${status}
            </div>
            <p style="color: #777; font-size: 14px;">
              Please log in to your account to view more details.
            </p>
          </div>
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            © 2025 Bulak LGU Smart Connect. All rights reserved.
          </div>
        </div>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}