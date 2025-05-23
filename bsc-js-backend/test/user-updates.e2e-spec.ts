import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

describe('User Update Functionality (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  // Interface for response data
  interface ResponseData {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    nameExtension?: string;
    email?: string;
    contactNumber?: string;
    roles?: string[];
    name?: string;
    defaultRole?: string;
    message?: string;
  }

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
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    roleRepository = moduleFixture.get<Repository<Role>>(
      getRepositoryToken(Role),
    );

    await app.init();

    // Create test roles
    await (roleRepository as any).save(citizenRole);
    await (roleRepository as any).save(adminRole);

    // Create test users with hashed passwords
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(testCitizen.password, salt);

    const citizenUser = (userRepository as any).create({
      ...testCitizen,
      password: hashedPassword,
      defaultRoleId: citizenRole.id,
    });

    const adminUser = (userRepository as any).create({
      ...testAdmin,
      password: hashedPassword,
      defaultRoleId: adminRole.id,
    });

    await (userRepository as any).save(citizenUser);
    await (userRepository as any).save(adminUser);

    // Assign roles to users - Fixed typing
    const savedCitizen = await (userRepository as any).findOne({
      where: { id: testCitizen.id },
      relations: ['roles'],
    });

    if (savedCitizen) {
      savedCitizen.roles = [citizenRole];
      await (userRepository as any).save(savedCitizen);
    }

    const savedAdmin = await (userRepository as any).findOne({
      where: { id: testAdmin.id },
      relations: ['roles'],
    });

    if (savedAdmin) {
      savedAdmin.roles = [citizenRole, adminRole];
      await (userRepository as any).save(savedAdmin);
    }

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
    await (userRepository as any).delete(testCitizen.id);
    await (userRepository as any).delete(testAdmin.id);
    await (roleRepository as any).delete(citizenRole.id);
    await (roleRepository as any).delete(adminRole.id);
    await app.close();
  });

  describe('User Update Profile', () => {
    it('should allow a citizen to update their own profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Citizen',
        contactNumber: '1234567890',
      };

      return request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(updateData)
        .expect(200)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.firstName).toBe(updateData.firstName);
          expect(responseData.lastName).toBe(updateData.lastName);
          expect(responseData.contactNumber).toBe(updateData.contactNumber);
          expect(responseData.name).toBe('Updated Citizen');
        });
    });

    it('should not allow updating to an existing email', async () => {
      return request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ email: testAdmin.email })
        .expect(409);
    });

    it('should allow updating password with valid length', async () => {
      return request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ password: 'newSecurePassword123' })
        .expect(200);
    });

    it('should reject password that is too short', async () => {
      return request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ password: 'short' })
        .expect(400);
    });

    it('should reject invalid email format', async () => {
      return request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ email: 'invalid-email' })
        .expect(400)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.message).toContain('Invalid email format');
        });
    });

    it('should update only provided fields', async () => {
      // First get current user data
      const profileResponse = await request(app.getHttpServer() as any)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      const originalData = profileResponse.body as ResponseData;

      // Update only contact number
      const updateResponse = await request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ contactNumber: '9999999999' })
        .expect(200);

      const responseData = updateResponse.body as ResponseData;

      // Verify other fields remain unchanged
      expect(responseData.firstName).toBe(originalData.firstName);
      expect(responseData.lastName).toBe(originalData.lastName);
      expect(responseData.email).toBe(originalData.email);
      expect(responseData.contactNumber).toBe('9999999999');
    });

    it('should properly update name when name components change', async () => {
      return request(app.getHttpServer() as any)
        .post('/auth/update-profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          firstName: 'New',
          middleName: 'Middle',
          lastName: 'Name',
          nameExtension: 'Jr.',
        })
        .expect(200)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.firstName).toBe('New');
          expect(responseData.middleName).toBe('Middle');
          expect(responseData.lastName).toBe('Name');
          expect(responseData.nameExtension).toBe('Jr.');
          expect(responseData.name).toBe('New Middle Name Jr.');
        });
    });
  });

  describe('Admin Update User', () => {
    it('should allow admin to update another user', async () => {
      const updateData = {
        firstName: 'Admin',
        lastName: 'Updated',
        contactNumber: '9876543210',
      };

      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.firstName).toBe(updateData.firstName);
          expect(responseData.lastName).toBe(updateData.lastName);
          expect(responseData.contactNumber).toBe(updateData.contactNumber);
          expect(responseData.name).toBe('Admin Updated');
        });
    });

    it('should allow admin to update user roles', async () => {
      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          roleIds: [citizenRole.id, adminRole.id],
          defaultRoleId: adminRole.id,
        })
        .expect(200)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.roles).toContain('admin');
          expect(responseData.roles).toContain('citizen');
          expect(responseData.defaultRole).toBe('admin');
        });
    });

    it('should not allow citizen to use admin endpoint', async () => {
      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testAdmin.id}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ firstName: 'Hacked' })
        .expect(403);
    });

    it('should validate role IDs', async () => {
      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleIds: [999] }) // Non-existent role ID
        .expect(400);
    });

    it('should reject setting default role that is not in roleIds', async () => {
      // First set user back to citizen only
      await request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          roleIds: [citizenRole.id],
          defaultRoleId: citizenRole.id,
        })
        .expect(200);

      // Now try to set admin as default without including it in roleIds
      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          defaultRoleId: adminRole.id, // Admin role
        })
        .expect(400)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.message).toContain(
            'Cannot set default role to a role the user does not have',
          );
        });
    });

    it('should handle setting empty role list', async () => {
      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${testCitizen.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          roleIds: [], // Empty role list
        })
        .expect(200)
        .then((response) => {
          const responseData = response.body as ResponseData;
          // User should still have at least citizen role from previous test
          expect(responseData.roles?.length).toBeGreaterThan(0);
        });
    });

    it('should reject updating non-existent user', async () => {
      const nonExistentUserId = 9999;
      return request(app.getHttpServer() as any)
        .post(`/auth/admin/update-user/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Nobody',
        })
        .expect(400)
        .then((response) => {
          const responseData = response.body as ResponseData;
          expect(responseData.message).toContain(
            `User with ID ${nonExistentUserId} not found`,
          );
        });
    });
  });
});
