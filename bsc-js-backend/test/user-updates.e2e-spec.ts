import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import 'class-transformer';

describe('User Update Functionality (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository;
  let roleRepository;

  // Test user data
  const testCitizen = {
    id: 1,
    email: 'citizen@example.com',
    username: 'testcitizen',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Citizen',
    name: 'Test Citizen',
  };

  const testAdmin = {
    id: 2,
    email: 'admin@example.com',
    username: 'testadmin',
    firstName: 'Test',
    lastName: 'Admin',
    name: 'Test Admin',
  };

  const citizenRole = { id: 1, name: 'citizen' };
  const adminRole = { id: 2, name: 'admin' };

  let citizenToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    );

    jwtService = moduleFixture.get<JwtService>(JwtService);
    userRepository = moduleFixture.get(getRepositoryToken(User));
    roleRepository = moduleFixture.get(getRepositoryToken(Role));

    await app.init();

    // Create test roles
    await roleRepository.save(citizenRole);
    await roleRepository.save(adminRole);

    // Create test users with hashed passwords
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(testCitizen.password, salt);

    const citizenUser = userRepository.create({
      ...testCitizen,
      password: hashedPassword,
      defaultRoleId: citizenRole.id,
    });

    const adminUser = userRepository.create({
      ...testAdmin,
      password: hashedPassword,
      defaultRoleId: adminRole.id,
    });

    await userRepository.save(citizenUser);
    await userRepository.save(adminUser);

    // Assign roles to users
    const savedCitizen = await userRepository.findOne({
      where: { id: testCitizen.id },
      relations: ['roles'],
    });
    savedCitizen.roles = [citizenRole];
    await userRepository.save(savedCitizen);

    const savedAdmin = await userRepository.findOne({
      where: { id: testAdmin.id },
      relations: ['roles'],
    });
    savedAdmin.roles = [citizenRole, adminRole];
    await userRepository.save(savedAdmin);

    // Generate JWT tokens
    citizenToken = jwtService.sign({
      sub: testCitizen.id,
      email: testCitizen.email,
      roles: ['citizen'],
    });

    adminToken = jwtService.sign({
      sub: testAdmin.id,
      email: testAdmin.email,
      roles: ['citizen', 'admin'],
    });
  });

  afterAll(async () => {
    // Clean up
    await userRepository.delete(testCitizen.id);
    await userRepository.delete(testAdmin.id);
    await roleRepository.delete(citizenRole.id);
    await roleRepository.delete(adminRole.id);
    await app.close();
  });

  describe('User Update Profile', () => {
    it('should allow a citizen to update their own profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Citizen',
        contactNumber: '1234567890',
      };

      return request(app.getHttpServer())
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(updateData)
        .expect(200)
        .then((response) => {
          expect(response.body.firstName).toBe(updateData.firstName);
          expect(response.body.lastName).toBe(updateData.lastName);
          expect(response.body.contactNumber).toBe(updateData.contactNumber);
          expect(response.body.name).toBe('Updated Citizen');
        });
    });

    it('should not allow updating to an existing email', async () => {
      return request(app.getHttpServer())
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ email: testAdmin.email })
        .expect(409);
    });

    it('should allow updating password with valid length', async () => {
      return request(app.getHttpServer())
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ password: 'newSecurePassword123' })
        .expect(200);
    });

    it('should reject password that is too short', async () => {
      return request(app.getHttpServer())
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ password: 'short' })
        .expect(400);
    });
  });

  describe('Admin Update User', () => {
    it('should allow admin to update another user', async () => {
      const updateData = {
        firstName: 'Admin',
        lastName: 'Updated',
        contactNumber: '9876543210',
      };

      return request(app.getHttpServer())
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .then((response) => {
          expect(response.body.firstName).toBe(updateData.firstName);
          expect(response.body.lastName).toBe(updateData.lastName);
          expect(response.body.contactNumber).toBe(updateData.contactNumber);
          expect(response.body.name).toBe('Admin Updated');
        });
    });

    it('should allow admin to update user roles', async () => {
      return request(app.getHttpServer())
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          roleIds: [citizenRole.id, adminRole.id],
          defaultRoleId: adminRole.id,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.roles).toContain('admin');
          expect(response.body.roles).toContain('citizen');
          expect(response.body.defaultRole).toBe('admin');
        });
    });

    it('should not allow citizen to use admin endpoint', async () => {
      return request(app.getHttpServer())
        .post(`/auth/admin/update-user/${testAdmin.id}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ firstName: 'Hacked' })
        .expect(403);
    });

    it('should validate role IDs', async () => {
      return request(app.getHttpServer())
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleIds: [999] }) // Non-existent role ID
        .expect(400);
    });
  });
});
