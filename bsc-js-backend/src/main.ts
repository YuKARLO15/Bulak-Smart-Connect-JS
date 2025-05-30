import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Minio from 'minio';

dotenv.config();

async function bootstrap() {
  // Debug env variables
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);

  const app = await NestFactory.create(AppModule);

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
    .setTitle('Bulak Smart Connect API')
    .setDescription(
      `
    REST API for Bulak Smart Connect Municipal Services System
    
    ## Features
    - User Authentication & Authorization
    - Queue Management System
    - Appointment Scheduling
    - Municipal Announcements
    - Role-based Access Control
    - MinIO Document Storage 
    
    ## Authentication
    Most endpoints require JWT authentication. Use the login endpoint to obtain a token.
  `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Bulak Smart Connect Team',
      'https://github.com/YuKARLO15/Bulak-Smart-Connect-JS',
      'contact@bulaksmartconnect.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
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
    .addTag('Authentication', 'User authentication and profile management')
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
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend IP
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Optional: Check and seed database before full startup
  const dataSource = app.get(DataSource);
  await seedDatabaseIfNeeded(dataSource);

  // Test MinIO connection
  await testMinIOConnection();

  await app.listen(process.env.PORT ?? 3000);
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

    // Ensure document-applications bucket exists
    const bucketName = process.env.MINIO_BUCKET_NAME || 'document-applications';
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
