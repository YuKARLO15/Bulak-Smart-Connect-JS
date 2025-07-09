import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import helmet from 'helmet';
import * as compression from 'compression';

dotenv.config();

// ✅ Simple console override function
function overrideConsoleInProduction() {
  const isProduction = process.env.NODE_ENV === 'production';
  const consoleEnabled = process.env.ENABLE_CONSOLE_LOGS === 'true';

  if (isProduction && !consoleEnabled) {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
    // Keep console.error for critical issues
  }
}

async function bootstrap() {
  // ✅ Override console BEFORE creating the app
  overrideConsoleInProduction();

  const app = await NestFactory.create(AppModule, {
    // ✅ Configure NestJS logger based on environment
    logger:
      process.env.NODE_ENV === 'production' &&
      process.env.ENABLE_CONSOLE_LOGS !== 'true'
        ? ['error'] // Only errors in production
        : ['log', 'error', 'warn', 'debug', 'verbose'], // All logs in development
  });

  const configService = app.get(ConfigService);

  // ✅ Create a logger instance for bootstrap context
  const logger = new Logger('Bootstrap');

  // Production security enhancements
  if (process.env.NODE_ENV === 'production') {
    try {
      app.use(
        helmet({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
            },
          },
          crossOriginEmbedderPolicy: false,
        }),
      );

      app.use(compression());
      app.getHttpAdapter().getInstance().set('trust proxy', 1); // Trust Render proxy

      logger.log('✅ Production security middleware enabled');
    } catch (error) {
      logger.error('❌ Failed to setup production middleware:', error.message);
      logger.warn('⚠️ Continuing without security middleware');
    }
  }

  // Debug env variables
  logger.debug('JWT_SECRET exists: ' + !!configService.get('JWT_SECRET'));
  logger.debug('JWT_SECRET length: ' + configService.get('JWT_SECRET')?.length);

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
      configService.get('SWAGGER_DESCRIPTION') ||
        `
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
    .addServer(
      `http://localhost:${configService.get('PORT') || 3000}`,
      'Development Server',
    )
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
    .addTag(
      'Authentication & OTP',
      '🔐 User authentication, registration, and OTP verification system',
    )
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
  const allowedOrigins = configService.get('ALLOWED_ORIGINS')?.split(',') || [
    configService.get('FRONTEND_URL') || 'http://localhost:5173',
  ];
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

  // Important: Use PORT environment variable for Render
  const port = process.env.PORT || configService.get('PORT') || 3000;
  const host = process.env.HOST || configService.get('HOST') || 'localhost';
  await app.listen(port, '0.0.0.0'); // Bind to all interfaces

  logger.log(
    `🚀 Application is running on: ${configService.get('SERVER_BASE_URL') || `http://${host}:${port}`}`,
  );
  logger.log(
    `📚 Swagger docs available at: ${configService.get('SWAGGER_URL') || `http://${host}:${port}/api/docs`}`,
  );
  logger.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  logger.log(`🔗 WebSocket CORS: ${configService.get('WS_CORS_ORIGIN')}`);
}

async function testMinIOConnection() {
  const logger = new Logger('MinIO'); // ✅ Create logger for this context

  try {
    logger.log('🧪 Testing MinIO connection...');

    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
    });

    // Test connection by listing buckets
    const buckets = await minioClient.listBuckets();
    logger.log(
      `✅ MinIO connection successful! Found ${buckets.length} buckets`,
    );

    // Ensure bulak-smart-connect bucket exists
    const bucketName = process.env.MINIO_BUCKET_NAME || 'bulak-smart-connect';
    const bucketExists = await minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      logger.log(`✅ Created bucket: ${bucketName}`);
    } else {
      logger.log(`✅ Bucket '${bucketName}' already exists`);
    }

    // Test file upload
    const testData = Buffer.from('Hello MinIO from Bulak Smart Connect!');
    const testObjectName = `test/connection-test-${Date.now()}.txt`;

    await minioClient.putObject(bucketName, testObjectName, testData);
    logger.log(`✅ Test file uploaded: ${testObjectName}`);

    // Clean up test file
    await minioClient.removeObject(bucketName, testObjectName);
    logger.log(`✅ Test file cleaned up`);

    logger.log('🎉 MinIO is ready for document storage!');
  } catch (error) {
    logger.error('❌ MinIO connection failed:', error.message);
    logger.warn('💡 Make sure MinIO server is running on localhost:9000');
    logger.warn('💡 Check your MinIO credentials in .env file');
    // Don't throw error to allow app to continue starting
  }
}

async function seedDatabaseIfNeeded(dataSource: DataSource) {
  const logger = new Logger('Database'); // ✅ Create logger for this context

  try {
    // Check if roles exist and create them if needed
    const roleRepo = dataSource.getRepository(Role);
    const count = await roleRepo.count();

    if (count === 0) {
      logger.log('🌱 Seeding database with default roles...');

      await roleRepo.save([
        { name: 'super_admin', description: 'Has all permissions' },
        { name: 'admin', description: 'Can manage staff and citizens' },
        { name: 'staff', description: 'Can process applications' },
        { name: 'citizen', description: 'Regular user' },
      ]);

      logger.log('🎉 Database seeding completed!');
    } else {
      logger.log('✅ Database already seeded with roles');
    }
  } catch (error) {
    logger.error('❌ Database seeding failed:', error.message);
  }
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during bootstrap:', err);
});
