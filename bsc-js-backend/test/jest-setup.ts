import { webcrypto } from 'node:crypto';

// Polyfill crypto for Node.js environment with proper typing
if (!global.crypto) {
  // Use type assertion to avoid TypeScript compatibility issues
  global.crypto = webcrypto as unknown as Crypto;
}

// Set NODE_ENV for tests
process.env.NODE_ENV = 'test';