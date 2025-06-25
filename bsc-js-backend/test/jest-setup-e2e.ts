import { webcrypto } from 'node:crypto';

// Polyfill crypto for Node.js environment with proper typing
if (!global.crypto) {
  // Use type assertion to avoid TypeScript compatibility issues
  global.crypto = webcrypto as unknown as Crypto;
}

// Set NODE_ENV for tests
process.env.NODE_ENV = 'test';

// Set test database environment variables
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USERNAME = 'root';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'bsc_test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_purposes_only';

// MinIO test configuration
process.env.MINIO_ENDPOINT = 'localhost';
process.env.MINIO_PORT = '9000';
process.env.MINIO_USE_SSL = 'false';
process.env.MINIO_ACCESS_KEY = 'minioadmin';
process.env.MINIO_SECRET_KEY = 'minioadmin123';
process.env.MINIO_BUCKET_NAME = 'test-bucket';
