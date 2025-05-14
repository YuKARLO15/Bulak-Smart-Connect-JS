import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';

dotenv.config();

async function bootstrap() {
  // Debug env variables
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend IP
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Optional: Check and seed database before full startup
  const dataSource = app.get(DataSource);
  await seedDatabaseIfNeeded(dataSource);

  await app.listen(process.env.PORT ?? 3000);
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

bootstrap()
  .catch(err => console.error('Error during bootstrap:', err));
