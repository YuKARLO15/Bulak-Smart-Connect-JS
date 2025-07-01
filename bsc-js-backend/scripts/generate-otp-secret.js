const crypto = require('crypto');

/**
 * Generate secure OTP secret for production use
 */
function generateOTPSecret() {
  // Generate 64 random bytes (512 bits) for maximum security
  const secret = crypto.randomBytes(64).toString('base64');
  
  console.log('🔐 Generated OTP Secret:');
  console.log('=====================================');
  console.log(secret);
  console.log('=====================================');
  console.log('');
  console.log('📝 Add this to your .env file:');
  console.log(`OTP_SECRET=${secret}`);
  console.log('');
  console.log('⚠️  SECURITY NOTES:');
  console.log('- Keep this secret secure and never commit it to version control');
  console.log('- Use a different secret for each environment (dev, staging, prod)');
  console.log('- Rotate this secret periodically for maximum security');
  console.log('- Store it securely in your environment variables');
  
  return secret;
}

// Generate and display the secret
if (require.main === module) {
  generateOTPSecret();
}

module.exports = { generateOTPSecret };