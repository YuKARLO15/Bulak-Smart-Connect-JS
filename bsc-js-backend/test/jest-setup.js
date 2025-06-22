const { webcrypto } = require('node:crypto');

// Polyfill crypto for Node.js environment
if (!global.crypto) {
  global.crypto = webcrypto;
}

// Set NODE_ENV for tests
process.env.NODE_ENV = 'test';