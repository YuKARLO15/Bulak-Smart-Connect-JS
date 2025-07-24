import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
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
        subject: '🔐 Bulak LGU Connect - Email Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Connect</h1>
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
              © 2025 Bulak LGU Connect. All rights reserved.
            </div>
          </div>
        `,
      },
      password_reset: {
        subject: '🔒 Bulak LGU Connect - Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Connect</h1>
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
              © 2025 Bulak LGU Connect. All rights reserved.
            </div>
          </div>
        `,
      },
      application_update: {
        subject: '📋 Bulak LGU Connect - Application Status Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1c4d5a 0%, #8aacd5 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Bulak LGU Connect</h1>
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
              © 2025 Bulak LGU Connect. All rights reserved.
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
            <h1 style="color: white; margin: 0;">Bulak LGU Connect</h1>
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
            © 2025 Bulak LGU Connect. All rights reserved.
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
    const subject = `🔔 Bulak LGU Connect - You're Almost Up! (Position #${position})`;

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
                  <h1 style="color: #2c3e50;">🎫 Bulak LGU Connect</h1>
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
                      Civil Registrar Office - Bulak LGU Connect
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
    const subject = `🎯 Bulak LGU Connect - Please Proceed to Counter!`;

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
                  <h1 style="color: #2c3e50;">🎫 Bulak LGU Connect</h1>
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
                      Civil Registrar Office - Bulak LGU Connect<br/>
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

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(
    email: string,
    appointmentNumber: string,
    appointmentDetails: any,
  ): Promise<void> {
    const subject = 'Appointment Confirmed - Bulak LGU Connect';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmed</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .appointment-card { background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .important-note { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Appointment Confirmed</h1>
            <p>Your appointment has been successfully booked!</p>
          </div>
          
          <div class="content">
            <p>Dear ${appointmentDetails.firstName || 'Valued Client'} ${appointmentDetails.lastName || ''},</p>
            
            <p>We're pleased to confirm your appointment with the Municipal Civil Registrar's Office.</p>
            
            <div class="appointment-card">
              <h3 style="margin-top: 0; color: #28a745;">Appointment Details</h3>
              <div class="detail-row">
                <span class="label">Appointment ID:</span>
                <span class="value">${appointmentNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${appointmentDetails.type || appointmentDetails.reasonOfVisit || 'Civil Registry Service'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${appointmentDetails.date || appointmentDetails.appointmentDate || 'TBD'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${appointmentDetails.time || appointmentDetails.appointmentTime || 'TBD'}</span>
              </div>
              ${
                appointmentDetails.phoneNumber
                  ? `
              <div class="detail-row">
                <span class="label">Contact:</span>
                <span class="value">${appointmentDetails.phoneNumber}</span>
              </div>
              `
                  : ''
              }
            </div>
            
            <div class="important-note">
              <h4 style="margin-top: 0;">📋 Important Reminders:</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Please arrive <strong>15 minutes before</strong> your scheduled time</li>
                <li>Bring all required documents and valid ID</li>
                <li>Late arrivals may need to reschedule</li>
                <li>Keep this confirmation email for your records</li>
              </ul>
            </div>
            
            <p>Thank you for using Bulak LGU Connect!</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(`✅ Appointment confirmation email sent to ${email}`);
  }

  /**
   * Send appointment status update email
   */
  async sendAppointmentStatusUpdate(
    email: string,
    appointmentNumber: string,
    newStatus: string,
    appointmentDetails: any,
  ): Promise<void> {
    const statusColors = {
      confirmed: '#28a745',
      completed: '#007bff',
      cancelled: '#dc3545',
      pending: '#ffc107',
    };

    const statusEmojis = {
      confirmed: '✅',
      completed: '🎉',
      cancelled: '❌',
      pending: '⏳',
    };

    const color = statusColors[newStatus] || '#6c757d';
    const emoji = statusEmojis[newStatus] || '📋';

    const subject = `Appointment ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} - ${appointmentNumber}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Status Update</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, ${color} 0%, ${color}cc 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .status-card { background-color: #f8f9fa; border-left: 4px solid ${color}; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .status-badge { display: inline-block; padding: 8px 16px; background-color: ${color}; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${emoji} Appointment Update</h1>
            <p>Your appointment status has been updated</p>
          </div>
          
          <div class="content">
            <p>Dear ${appointmentDetails.firstName || 'Valued Client'} ${appointmentDetails.lastName || ''},</p>
            
            <p>We're writing to inform you that your appointment status has been updated.</p>
            
            <div class="status-card">
              <h3 style="margin-top: 0;">Appointment Status</h3>
              <div class="status-badge">${newStatus.toUpperCase()}</div>
              
              <div class="detail-row">
                <span class="label">Appointment ID:</span>
                <span class="value">${appointmentNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${appointmentDetails.type || appointmentDetails.reasonOfVisit || 'Civil Registry Service'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${appointmentDetails.date || appointmentDetails.appointmentDate || 'TBD'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${appointmentDetails.time || appointmentDetails.appointmentTime || 'TBD'}</span>
              </div>
            </div>
            
            ${
              newStatus === 'confirmed'
                ? `
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your appointment is confirmed!</strong> Please remember to:</p>
              <ul>
                <li>Arrive 15 minutes before your scheduled time</li>
                <li>Bring all required documents and valid ID</li>
                <li>Keep this confirmation for your records</li>
              </ul>
            </div>
            `
                : ''
            }
            
            ${
              newStatus === 'completed'
                ? `
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your appointment has been completed!</strong> Thank you for visiting our office.</p>
            </div>
            `
                : ''
            }
            
            ${
              newStatus === 'cancelled'
                ? `
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your appointment has been cancelled.</strong></p>
              <p>If you need to reschedule, please contact our office or book a new appointment.</p>
            </div>
            `
                : ''
            }
            
            <p>Thank you for using Bulak LGU Connect!</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(
      `✅ Appointment status update email sent to ${email} - Status: ${newStatus}`,
    );
  }

  /**
   * Send appointment cancellation email
   */
  async sendAppointmentCancellation(
    email: string,
    appointmentNumber: string,
    appointmentDetails: any,
    reason?: string,
  ): Promise<void> {
    const subject = `Appointment Cancelled - ${appointmentNumber}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Cancelled</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .appointment-card { background-color: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .rebook-section { background-color: #e2f3ff; border: 1px solid #b8daff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Appointment Cancelled</h1>
            <p>We regret to inform you that your appointment has been cancelled</p>
          </div>
          
          <div class="content">
            <p>Dear ${appointmentDetails.firstName || 'Valued Client'} ${appointmentDetails.lastName || ''},</p>
            
            <p>We regret to inform you that your appointment has been cancelled.</p>
            
            <div class="appointment-card">
              <h3 style="margin-top: 0; color: #dc3545;">Cancelled Appointment Details</h3>
              <div class="detail-row">
                <span class="label">Appointment ID:</span>
                <span class="value">${appointmentNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${appointmentDetails.type || appointmentDetails.reasonOfVisit || 'Civil Registry Service'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Scheduled Date:</span>
                <span class="value">${appointmentDetails.date || appointmentDetails.appointmentDate || 'TBD'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Scheduled Time:</span>
                <span class="value">${appointmentDetails.time || appointmentDetails.appointmentTime || 'TBD'}</span>
              </div>
              ${
                reason
                  ? `
              <div class="detail-row">
                <span class="label">Reason:</span>
                <span class="value">${reason}</span>
              </div>
              `
                  : ''
              }
            </div>
            
            <div class="rebook-section">
              <h4 style="margin-top: 0;">📅 Need to Reschedule?</h4>
              <p>You can easily book a new appointment through our online system.</p>
              <p>We apologize for any inconvenience this may have caused.</p>
            </div>
            
            <p>Thank you for your understanding.</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(`✅ Appointment cancellation email sent to ${email}`);
  }

  /**
   * Send appointment reminder email
   */
  async sendAppointmentReminder(
    email: string,
    appointmentNumber: string,
    appointmentDetails: any,
  ): Promise<void> {
    const subject = `Reminder: Appointment Tomorrow - ${appointmentNumber}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .appointment-card { background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .reminder-box { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .checklist { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Appointment Reminder</h1>
            <p>Don't forget about your appointment tomorrow!</p>
          </div>
          
          <div class="content">
            <p>Dear ${appointmentDetails.firstName} ${appointmentDetails.lastName},</p>
            
            <p>This is a friendly reminder about your upcoming appointment with the Municipal Civil Registrar's Office.</p>
            
            <div class="appointment-card">
              <h3 style="margin-top: 0; color: #007bff;">Tomorrow's Appointment</h3>
              <div class="detail-row">
                <span class="label">Appointment ID:</span>
                <span class="value">${appointmentNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${appointmentDetails.type}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${appointmentDetails.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${appointmentDetails.time}</span>
              </div>
            </div>
            
            <div class="checklist">
              <h4 style="margin-top: 0;">📋 Pre-Appointment Checklist:</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>✅ Prepare all required documents</li>
                <li>✅ Bring valid government-issued ID</li>
                <li>✅ Arrive 15 minutes before scheduled time</li>
                <li>✅ Have this appointment confirmation ready</li>
                <li>✅ Bring exact payment if applicable</li>
              </ul>
            </div>
            
            <div class="reminder-box">
              <h4 style="margin-top: 0;">⚠️ Important:</h4>
              <p>Please arrive on time as late arrivals may need to reschedule. If you need to cancel or reschedule, please contact our office as soon as possible.</p>
            </div>
            
            <p>We look forward to seeing you tomorrow!</p>
            
            <p>Thank you for using Bulak LGU Connect!</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(`✅ Appointment reminder email sent to ${email}`);
  }

  /**
 * Get payment information based on application type and subtype
 */
private getPaymentInfo(applicationType: string, applicationSubtype?: string): { items: Array<{item: string, amount: string}>, total?: string, duration?: string } {
  const type = applicationType?.toLowerCase() || '';
  const subtype = applicationSubtype?.toLowerCase() || '';

  // Birth Certificate Applications
  if (type.includes('birth')) {
    // Correction Applications
    if (subtype.includes('correction')) {
      if (subtype.includes('first name')) {
        return {
          items: [
            { item: 'Filing Fee', amount: '₱300.00' },
            { item: 'Newspaper Publication', amount: '₱3,500.00 (newspaper of your choice)' },
            { item: 'Other Fees (notarized, new PSA corrected copy)', amount: '₱500.00' }
          ],
          total: '₱4,300.00',
          duration: '4-6 months'
        };
      } else if (subtype.includes('clerical')) {
        return {
          items: [
            { item: 'Filing Fee', amount: '₱1,000.00' },
            { item: 'Miscellaneous Expenses', amount: '₱600.00' },
            { item: 'Other Fees (notarized, new PSA corrected copy)', amount: '₱500.00' }
          ],
          total: '₱2,100.00',
          duration: '4-6 months'
        };
      } else if (subtype.includes('sex') || subtype.includes('date of birth')) {
        return {
          items: [
            { item: 'Filing Fee', amount: '₱300.00' },
            { item: 'Newspaper Publication', amount: '₱3,500.00 (newspaper of your choice)' },
            { item: 'Other Fees (notarized, new PSA corrected copy)', amount: '₱500.00' }
          ],
          total: '₱4,300.00',
          duration: '4-6 months'
        };
      }
    }
    
    // Delayed Registration Applications
    if (subtype.includes('delayed')) {
      if (subtype.includes('above 18')) {
        return {
          items: [
            { item: 'Filing Fee', amount: '₱300.00' },
            { item: 'Miscellaneous Expenses', amount: '₱600.00' },
            { item: 'Other Fees (notarized, PSA copy)', amount: '₱500.00' }
          ],
          total: '₱1,400.00',
          duration: '4-6 months'
        };
      } else if (subtype.includes('below 18')) {
        return {
          items: [
            { item: 'Filing Fee', amount: '₱300.00' },
            { item: 'Miscellaneous Expenses', amount: '₱600.00' },
            { item: 'Other Fees (notarized, PSA copy)', amount: '₱500.00' }
          ],
          total: '₱1,400.00',
          duration: '10 days'
        };
      } else if (subtype.includes('foreign parent')) {
        return {
          items: [
            { item: 'Filing Fee', amount: '₱300.00' },
            { item: 'Miscellaneous Expenses', amount: '₱600.00' },
            { item: 'Other Fees (notarized, PSA copy)', amount: '₱500.00' }
          ],
          total: '₱1,400.00',
          duration: '4-6 months'
        };
      }
    }

    // Regular/Copy Applications
    if (subtype.includes('regular') || subtype.includes('copy') || subtype.includes('certified true copy')) {
      return {
        items: [
          { item: 'Application Fee', amount: '₱50.00' },
          { item: 'Processing Fee', amount: '₱100.00' }
        ],
        total: '₱150.00',
        duration: '3-5 working days'
      };
    }
  }

  // Marriage Applications
  if (type.includes('marriage')) {
    if (subtype.includes('license')) {
      return {
        items: [
          { item: 'Marriage License Fee', amount: '₱500.00' },
          { item: 'Community Tax Certificate', amount: '₱30.00' },
          { item: 'Processing Fee', amount: '₱100.00' }
        ],
        total: '₱630.00',
        duration: '10 working days (after completion of requirements)'
      };
    } else if (subtype.includes('certificate')) {
      return {
        items: [
          { item: 'Marriage Certificate Fee', amount: '₱150.00' },
          { item: 'Processing Fee', amount: '₱50.00' }
        ],
        total: '₱200.00',
        duration: '3-5 working days'
      };
    }
  }

  // Default fallback
  return {
    items: [
      { item: 'Processing Fee', amount: 'To be determined' }
    ],
    duration: 'Please contact our office for details'
  };
}

  /**
   * Send document application confirmation email
   */
  async sendDocumentApplicationConfirmation(
    email: string,
    applicationId: string,
    applicationType: string,
    applicationSubtype?: string,
    applicantName?: string,
    submissionDate?: string,
    status: string = 'Pending',
    statusMessage?: string,
  ): Promise<void> {
    const subject = `Application Submitted - ${applicationId}`;
    const paymentInfo = this.getPaymentInfo(applicationType, applicationSubtype);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .application-card { background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .status-badge { display: inline-block; padding: 8px 16px; background-color: #ffc107; color: #212529; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Submitted</h1>
            <p>Your document application has been successfully submitted!</p>
          </div>
          
          <div class="content">
            <p>Dear ${applicantName || 'Valued Client'},</p>
            
            <p>Thank you for submitting your document application through Bulak LGU Connect.</p>
            
            <div class="application-card">
              <h3 style="margin-top: 0; color: #28a745;">Application Details</h3>
              <div class="detail-row">
                <span class="label">Application ID:</span>
                <span class="value">${applicationId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Document Type:</span>
                <span class="value">${applicationType}</span>
              </div>
              ${
                applicationSubtype
                  ? `
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${applicationSubtype}</span>
              </div>
              `
                  : ''
              }
              <div class="detail-row">
                <span class="label">Submission Date:</span>
                <span class="value">${submissionDate || new Date().toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value"><span class="status-badge">${status}</span></span>
              </div>
            </div>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0;">📋 What's Next?</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Your application is being reviewed by our staff</li>
                <li>You'll receive updates via email when status changes</li>
                <li>Keep this confirmation email for your records</li>
                <li>Processing time varies by document type</li>
              </ul>
            </div>
            
            <p>Thank you for using Bulak LGU Connect!</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(
      `✅ Document application confirmation email sent to ${email}`,
    );
  }

  /**
   * Send document application status update email
   */
  async sendDocumentApplicationStatusUpdate(
    email: string,
    applicationId: string,
    newStatus: string,
    applicationType: string,
    applicationSubtype?: string,
    applicantName?: string,
    previousStatus?: string,
    statusMessage?: string,
  ): Promise<void> {
    const statusColors = {
      pending: '#ffc107',
      approved: '#28a745',
      declined: '#dc3545',
      rejected: '#dc3545',
      'ready for pickup': '#007bff',
      completed: '#17a2b8',
    };

    const statusEmojis = {
      pending: '⏳',
      approved: '✅',
      declined: '❌',
      rejected: '❌',
      'ready for pickup': '📦',
      completed: '🎉',
    };

    const color = statusColors[newStatus.toLowerCase()] || '#6c757d';
    const emoji = statusEmojis[newStatus.toLowerCase()] || '📋';

    const subject = `Application ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} - ${applicationId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Status Update</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, ${color} 0%, ${color}cc 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .status-card { background-color: #f8f9fa; border-left: 4px solid ${color}; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .status-badge { display: inline-block; padding: 8px 16px; background-color: ${color}; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .status-message { background-color: #fffbe6; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${emoji} Application Update</h1>
            <p>Your application status has been updated</p>
          </div>
          
          <div class="content">
            <p>Dear ${applicantName || 'Valued Client'},</p>
            
            <p>We're writing to inform you that your document application status has been updated.</p>
            
            <div class="status-card">
              <h3 style="margin-top: 0;">Application Status</h3>
              <div class="status-badge">${newStatus.toUpperCase()}</div>
              
              <div class="detail-row">
                <span class="label">Application ID:</span>
                <span class="value">${applicationId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Document Type:</span>
                <span class="value">${applicationType}</span>
              </div>
              ${
                applicationSubtype
                  ? `
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${applicationSubtype}</span>
              </div>
              `
                  : ''
              }
            </div>
            
            ${
              statusMessage
                ? `
            <div class="status-message">
              <strong>📝 Message from Administrator:</strong><br>
              <span style="color: #333; margin-top: 8px; display: block;">${statusMessage}</span>
            </div>
            `
                : ''
            }
            
            ${
              newStatus.toLowerCase() === 'approved'
                ? `
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Great news! Your application has been approved!</strong></p>
              <p>Your document will be processed and prepared for release.</p>
            </div>
            `
                : ''
            }
            
            ${
              newStatus.toLowerCase() === 'ready for pickup'
                ? `
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your document is ready for pickup!</strong></p>
              <p>Please visit our office during business hours to collect your document. Bring a valid ID and this email confirmation.</p>
            </div>
            `
                : ''
            }
            
            ${
              newStatus.toLowerCase() === 'declined' ||
              newStatus.toLowerCase() === 'rejected'
                ? `
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your application has been declined.</strong></p>
              <p>Please contact our office for more information or to resubmit with the required corrections.</p>
            </div>
            `
                : ''
            }
            
            <p>Thank you for using Bulak LGU Connect!</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(
      `✅ Document application status update email sent to ${email} - Status: ${newStatus}`,
    );
  }

  /**
   * Send document application approval email
   */
  async sendDocumentApplicationApproval(
    email: string,
    applicationId: string,
    applicationType: string,
    applicationSubtype?: string,
    applicantName?: string,
  ): Promise<void> {
    return this.sendDocumentApplicationStatusUpdate(
      email,
      applicationId,
      'approved',
      applicationType,
      applicationSubtype,
      applicantName,
    );
  }

  /**
   * Send document application rejection email
   */
  async sendDocumentApplicationRejection(
    email: string,
    applicationId: string,
    applicationType: string,
    applicationSubtype?: string,
    applicantName?: string,
    rejectionReason?: string,
    statusMessage?: string,
  ): Promise<void> {
    const subject = `Application Declined - ${applicationId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Declined</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .application-card { background-color: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          .resubmit-section { background-color: #e2f3ff; border: 1px solid #b8daff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Application Declined</h1>
            <p>We regret to inform you that your application requires review</p>
          </div>
          
          <div class="content">
            <p>Dear ${applicantName || 'Valued Client'},</p>
            
            <p>We regret to inform you that your document application has been declined.</p>
            
            <div class="application-card">
              <h3 style="margin-top: 0; color: #dc3545;">Declined Application Details</h3>
              <div class="detail-row">
                <span class="label">Application ID:</span>
                <span class="value">${applicationId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Document Type:</span>
                <span class="value">${applicationType}</span>
              </div>
              ${
                applicationSubtype
                  ? `
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${applicationSubtype}</span>
              </div>
              `
                  : ''
              }
              ${
                rejectionReason || statusMessage
                  ? `
              <div class="detail-row">
                <span class="label">Reason:</span>
                <span class="value">${statusMessage || rejectionReason}</span>
              </div>
              `
                  : ''
              }
            </div>
            
            <div class="resubmit-section">
              <h4 style="margin-top: 0;">📝 Need to Resubmit?</h4>
              <p>You can submit a new application with the required corrections.</p>
              <p>Please contact our office if you need assistance with the requirements.</p>
            </div>
            
            <p>We apologize for any inconvenience this may have caused.</p>
          </div>
          
          <div class="footer">
            <p>Municipal Civil Registrar's Office<br>
            Bulak Local Government Unit<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject,
      html,
    });

    this.logger.log(`✅ Document application rejection email sent to ${email}`);
  }
}
