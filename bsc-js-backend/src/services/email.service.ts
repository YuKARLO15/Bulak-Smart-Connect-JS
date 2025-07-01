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
            <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Email Verification Required</h2>
              <p style="font-size: 16px; color: #555;">
                Please use the following OTP to verify your email address:
              </p>
              <div style="background: #1c4d5a; color: white; font-size: 32px; font-weight: bold; 
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
        `,
      },
      password_reset: {
        subject: '🔒 Bulak LGU Smart Connect - Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p style="font-size: 16px; color: #555;">
                Use this OTP to reset your password:
              </p>
              <div style="background: #1c4d5a; color: white; font-size: 32px; font-weight: bold; 
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
        `,
      },
      application_update: {
        subject: '📋 Bulak LGU Smart Connect - Application Status Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Smart Connect</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Application Status Update</h2>
              <p style="font-size: 16px; color: #555;">
                Your application status has been updated. Please check your dashboard for details.
              </p>
              <div style="background: #1c4d5a; color: white; font-size: 16px; font-weight: bold; 
                          text-align: center; padding: 15px; margin: 20px 0; border-radius: 8px;">
                Status: ${otp}
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              © 2025 Bulak LGU Smart Connect. All rights reserved.
            </div>
          </div>
        `,
      },
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

  async sendApplicationNotification(
    email: string,
    applicationId: string,
    status: string,
    applicationType: string,
  ) {
    const statusColors = {
      Pending: '#f39c12',
      Approved: '#27ae60',
      Rejected: '#e74c3c',
      'Ready for Pickup': '#3498db',
    };

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: `📋 Application ${applicationId} - Status: ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
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

  async sendQueuePositionAlert(
    email: string,
    queueNumber: string,
    position: number,
    estimatedTime: string,
  ): Promise<any> {
    const subject = `🔔 Bulak LGU Smart Connect - You're Almost Up! (Position #${position})`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Queue Position Alert</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2c3e50;">🎫 Bulak LGU Smart Connect</h1>
                  <p style="color: #7f8c8d;">Queue Position Alert</p>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #e17055; margin-top: 0; text-align: center;">⚡ You're Almost Up!</h2>
                  <div style="text-align: center;">
                      <p style="font-size: 18px; margin: 10px 0;">
                          <strong>Queue Number:</strong> <span style="font-size: 24px; color: #2d3436;">${queueNumber}</span>
                      </p>
                      <p style="font-size: 18px; margin: 10px 0;">
                          <strong>Current Position:</strong> <span style="font-size: 24px; color: #e17055;">#${position}</span>
                      </p>
                      <p style="font-size: 16px; margin: 10px 0;">
                          <strong>Estimated Wait Time:</strong> ${estimatedTime}
                      </p>
                  </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #2980b9; margin-top: 0;">📋 Please Prepare:</h3>
                  <ul style="color: #555;">
                      <li>Have your documents ready</li>
                      <li>Stay nearby - you'll be called soon!</li>
                      <li>Check the queue display at the office</li>
                      <li>Keep this email for reference</li>
                  </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #7f8c8d; font-size: 14px;">
                      Thank you for your patience! 🙏<br/>
                      Civil Registrar Office - Bulak LGU Smart Connect
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject,
      html,
    });
  }

  async sendQueueStatusUpdate(
    email: string,
    queueNumber: string,
    status: string,
    message: string,
  ): Promise<any> {
    const subject = `🎯 Bulak LGU Smart Connect - Please Proceed to Counter!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Now Serving</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2c3e50;">🎫 Bulak LGU Smart Connect</h1>
                  <p style="color: #7f8c8d;">Now Serving</p>
              </div>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #27ae60; margin-top: 0; text-align: center;">🎯 NOW SERVING</h2>
                  <div style="text-align: center;">
                      <p style="font-size: 18px; margin: 10px 0;">
                          <strong>Queue Number:</strong> <span style="font-size: 32px; color: #2d3436; font-weight: bold;">${queueNumber}</span>
                      </p>
                      <p style="font-size: 18px; margin: 15px 0; color: #27ae60; font-weight: bold;">
                          ${message}
                      </p>
                  </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #2980b9; margin-top: 0;">📍 Next Steps:</h3>
                  <ul style="color: #555;">
                      <li><strong>Proceed to the counter immediately</strong></li>
                      <li>Bring all your documents</li>
                      <li>Present this notification if requested</li>
                      <li>Thank you for using our digital queue system!</li>
                  </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #7f8c8d; font-size: 14px;">
                      Civil Registrar Office - Bulak LGU Smart Connect<br/>
                      Serving you better with technology! 🙏
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject,
      html,
    });
  }
}
