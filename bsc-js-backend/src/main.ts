import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Debug env variables
  console.log('JWT_SECRET exists:', !!configService.get('JWT_SECRET'));
  console.log('JWT_SECRET length:', configService.get('JWT_SECRET')?.length);

  // Set up global validation pipe with transformation enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE') || 'Bulak Smart Connect API')
    .setDescription(
      configService.get('SWAGGER_DESCRIPTION') || `
    🏛️ **REST API for Bulak Smart Connect Municipal Services System**
    
    ## 🌟 Features
    - **🔐 User Authentication & Authorization** with JWT tokens
    - **📧 OTP Email Verification System** for secure operations
    - **🔄 Queue Management System** for municipal services
    - **📅 Appointment Scheduling** with calendar integration
    - **📢 Municipal Announcements** and notifications
    - **👥 Role-based Access Control** (Citizen, Admin, Super Admin)
    - **📁 MinIO Document Storage** for file management
    - **🔐 Password Reset** with email verification
    
    ## 🔐 Authentication
    Most endpoints require JWT authentication. Use the \`/auth/login\` endpoint to get a JWT token,
    then include it in the Authorization header: \`Bearer <your-token>\`
    
    ## 📧 OTP System Features
    - ✅ Secure 6-digit OTP codes with time-based expiration
    - ⏰ 5-minute expiration time for security
    - 📧 Professional HTML email templates
    - 🎯 Multiple purposes (verification, password_reset)
    - 🛡️ Anti-spam protection and rate limiting
    - 🔄 Single-use OTP enforcement
    
    **OTP Flow:**
    1. \`POST /auth/send-otp\` - Generate and send OTP
    2. \`POST /auth/verify-otp\` - Verify OTP code
    3. Complete your operation (registration, password reset, etc.)
    
    ## 🛡️ Security Features
    - Password Requirements: 8+ chars, uppercase, lowercase, numbers, special chars
    - JWT Tokens: Secure session management with expiration
    - OTP Security: Time-limited, single-use verification codes
    - Rate Limiting: Prevents abuse and spam attacks
    - Input Validation: Comprehensive request validation
    
    ## 📱 Integration Ready
    - React components available for OTP verification
    - Material-UI forgot password dialogs
    - Real-time validation and feedback
    - Mobile-responsive design
  `,
    )
    .setVersion(configService.get('SWAGGER_VERSION') || '1.2.0')
    .setContact(
      'Bulak Smart Connect Team',
      'https://github.com/YuKARLO15/Bulak-Smart-Connect-JS',
      'contact@bulaksmartconnect.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${configService.get('PORT') || 3000}`, 'Development Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token (without "Bearer " prefix)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication & OTP', '🔐 User authentication, registration, and OTP verification system')
    .addTag(
      'Queue Management',
      'Real-time queue management for municipal services',
    )
    .addTag('Appointments', 'Appointment scheduling system')
    .addTag('Announcements', 'Municipal announcements and notifications')
    .addTag('Roles', 'Role and permission management')
    .addTag(
      'Document Applications',
      'Document application management with MinIO storage',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  const allowedOrigins = configService.get('ALLOWED_ORIGINS')?.split(',') || [configService.get('FRONTEND_URL') || 'http://localhost:5173'];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Optional: Check and seed database before full startup
  const dataSource = app.get(DataSource);
  await seedDatabaseIfNeeded(dataSource);

  // Test MinIO connection
  await testMinIOConnection();

  const port = configService.get('PORT') || 3000;
  const host = configService.get('HOST') || 'localhost';
  await app.listen(port);
  
  console.log(`🚀 Application is running on: ${configService.get('SERVER_BASE_URL') || `http://${host}:${port}`}`);
  console.log(`📚 Swagger docs available at: ${configService.get('SWAGGER_URL') || `http://${host}:${port}/api/docs`}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🔗 WebSocket CORS: ${configService.get('WS_CORS_ORIGIN')}`);
}

async function testMinIOConnection() {
  try {
    console.log('🧪 Testing MinIO connection...');

    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
    });

    // Test connection by listing buckets
    const buckets = await minioClient.listBuckets();
    console.log(
      `✅ MinIO connection successful! Found ${buckets.length} buckets`,
    );

    // Ensure bulak-smart-connect bucket exists
    const bucketName = process.env.MINIO_BUCKET_NAME || 'bulak-smart-connect';
    const bucketExists = await minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ Created bucket: ${bucketName}`);
    } else {
      console.log(`✅ Bucket '${bucketName}' already exists`);
    }

    // Test file upload
    const testData = Buffer.from('Hello MinIO from Bulak Smart Connect!');
    const testObjectName = `test/connection-test-${Date.now()}.txt`;

    await minioClient.putObject(bucketName, testObjectName, testData);
    console.log(`✅ Test file uploaded: ${testObjectName}`);

    // Clean up test file
    await minioClient.removeObject(bucketName, testObjectName);
    console.log(`✅ Test file cleaned up`);

    console.log('🎉 MinIO is ready for document storage!');
  } catch (error) {
    console.error(
      '❌ MinIO connection failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    console.error('💡 Make sure MinIO server is running on localhost:9000');
    console.error('💡 Check your MinIO credentials in .env file');
    // Don't throw error to allow app to continue starting
  }
}

async function seedDatabaseIfNeeded(dataSource: DataSource) {
  // Check if roles exist and create them if needed
  // This helps prevent sync issues with references
  const roleRepo = dataSource.getRepository(Role);
  const count = await roleRepo.count();

  if (count === 0) {
    await roleRepo.save([
      { name: 'super_admin', description: 'Has all permissions' },
      { name: 'admin', description: 'Can manage staff and citizens' },
      { name: 'staff', description: 'Can process applications' },
      { name: 'citizen', description: 'Regular user' },
    ]);
  }
}

bootstrap().catch((err) => console.error('Error during bootstrap:', err));
