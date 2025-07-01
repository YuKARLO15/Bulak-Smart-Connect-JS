const crypto = require('crypto');

/**
 * Generate secure JWT secret for production use
 */
function generateJWTSecret() {
  // Generate 64 random bytes (512 bits) for maximum security
  const secret = crypto.randomBytes(64).toString('hex');
  
  console.log('🔐 Generated JWT Secret:');
  console.log('=====================================');
  console.log(secret);
  console.log('=====================================');
  console.log('');
  console.log('📝 Add this to your .env file:');
  console.log(`JWT_SECRET=${secret}`);
  console.log('');
  console.log('⚠️  SECURITY NOTES:');
  console.log('- Keep this secret secure and never commit it to version control');
  console.log('- Use a different secret for each environment (dev, staging, prod)');
  console.log('- Rotate this secret periodically for maximum security');
  console.log('- This secret is used to sign and verify JWT tokens');
  console.log('- Minimum recommended length: 64 characters (this generates 128)');
  
  return secret;
}

// Generate and display the secret
if (require.main === module) {
  generateJWTSecret();
}

module.exports = { generateJWTSecret };