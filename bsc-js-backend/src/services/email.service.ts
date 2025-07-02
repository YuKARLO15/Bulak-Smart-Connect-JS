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

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(
    email: string,
    appointmentNumber: string,
    appointmentDetails: any,
  ): Promise<void> {
    const subject = 'Appointment Confirmed - Bulak LGU Smart Connect';
    
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
          .btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Appointment Confirmed</h1>
            <p>Your appointment has been successfully booked!</p>
          </div>
          
          <div class="content">
            <p>Dear ${appointmentDetails.firstName} ${appointmentDetails.lastName},</p>
            
            <p>We're pleased to confirm your appointment with the Municipal Civil Registrar's Office.</p>
            
            <div class="appointment-card">
              <h3 style="margin-top: 0; color: #28a745;">Appointment Details</h3>
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
              <div class="detail-row">
                <span class="label">Name:</span>
                <span class="value">${appointmentDetails.firstName} ${appointmentDetails.lastName}</span>
              </div>
              ${appointmentDetails.phoneNumber ? `
              <div class="detail-row">
                <span class="label">Contact:</span>
                <span class="value">${appointmentDetails.phoneNumber}</span>
              </div>
              ` : ''}
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
            
            <p>If you need to make changes to your appointment, please contact our office as soon as possible.</p>
            
            <p>Thank you for using Bulak LGU Smart Connect!</p>
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

    console.log(`✅ Appointment confirmation email sent to ${email}`);
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
      'confirmed': '#28a745',
      'completed': '#007bff',
      'cancelled': '#dc3545',
      'pending': '#ffc107'
    };

    const statusEmojis = {
      'confirmed': '✅',
      'completed': '🎉',
      'cancelled': '❌',
      'pending': '⏳'
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
            <p>Dear ${appointmentDetails.firstName} ${appointmentDetails.lastName},</p>
            
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
            
            ${newStatus === 'confirmed' ? `
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your appointment is confirmed!</strong> Please remember to:</p>
              <ul>
                <li>Arrive 15 minutes before your scheduled time</li>
                <li>Bring all required documents and valid ID</li>
                <li>Keep this confirmation for your records</li>
              </ul>
            </div>
            ` : ''}
            
            ${newStatus === 'completed' ? `
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your appointment has been completed!</strong> Thank you for visiting our office.</p>
              <p>If you have any questions about your documents or need additional services, please don't hesitate to contact us.</p>
            </div>
            ` : ''}
            
            ${newStatus === 'cancelled' ? `
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your appointment has been cancelled.</strong></p>
              <p>If you need to reschedule or have any questions, please contact our office or book a new appointment through our system.</p>
            </div>
            ` : ''}
            
            <p>Thank you for using Bulak LGU Smart Connect!</p>
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

    console.log(`✅ Appointment status update email sent to ${email} - Status: ${newStatus}`);
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
          .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Appointment Cancelled</h1>
            <p>We regret to inform you that your appointment has been cancelled</p>
          </div>
          
          <div class="content">
            <p>Dear ${appointmentDetails.firstName} ${appointmentDetails.lastName},</p>
            
            <p>We regret to inform you that your appointment scheduled with the Municipal Civil Registrar's Office has been cancelled.</p>
            
            <div class="appointment-card">
              <h3 style="margin-top: 0; color: #dc3545;">Cancelled Appointment Details</h3>
              <div class="detail-row">
                <span class="label">Appointment ID:</span>
                <span class="value">${appointmentNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${appointmentDetails.type}</span>
              </div>
              <div class="detail-row">
                <span class="label">Scheduled Date:</span>
                <span class="value">${appointmentDetails.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Scheduled Time:</span>
                <span class="value">${appointmentDetails.time}</span>
              </div>
              ${reason ? `
              <div class="detail-row">
                <span class="label">Reason:</span>
                <span class="value">${reason}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="rebook-section">
              <h4 style="margin-top: 0;">📅 Need to Reschedule?</h4>
              <p>You can easily book a new appointment through our online system or contact our office directly.</p>
              <p>We apologize for any inconvenience this may have caused.</p>
            </div>
            
            <p>If you have any questions or concerns, please don't hesitate to contact our office.</p>
            
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

    console.log(`✅ Appointment cancellation email sent to ${email}`);
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
            
            <p>Thank you for using Bulak LGU Smart Connect!</p>
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

    console.log(`✅ Appointment reminder email sent to ${email}`);
  }
}
