const fs = require('fs');
const path = require('path');
const { generateOTPSecret } = require('./generate-otp-secret');
const { generateJWTSecret } = require('./generate-jwt-secret');

/**
 * Complete setup script for OTP system and JWT security
 */
function setupComplete() {
  console.log('🚀 Setting up Bulak Smart Connect Security System...\n');
  
  // Step 1: Check if .env exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from .env.example...');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env file created\n');
    } else {
      console.log('❌ .env.example not found. Please create it first.\n');
      return;
    }
  }
  
  // Step 2: Generate secrets
  console.log('🔐 Generating security secrets...\n');
  
  const jwtSecret = generateJWTSecret();
  console.log('\n🔑 Generating OTP secret...\n');
  const otpSecret = generateOTPSecret();
  
  // Step 3: Update .env with secrets
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update JWT secret
  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);
  } else {
    envContent += `\n# JWT Configuration\nJWT_SECRET=${jwtSecret}\n`;
  }
  
  // Update OTP secret
  if (envContent.includes('OTP_SECRET=')) {
    envContent = envContent.replace(/OTP_SECRET=.*/, `OTP_SECRET=${otpSecret}`);
  } else {
    envContent += `\n# OTP Configuration\nOTP_SECRET=${otpSecret}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Security secrets added to .env file\n');
  
  // Step 4: Complete setup checklist
  console.log('📋 COMPLETE SETUP CHECKLIST:');
  console.log('');
  console.log('✅ 1. JWT secret generated and added to .env');
  console.log('✅ 2. OTP secret generated and added to .env');
  console.log('⏳ 3. Configure database settings in .env:');
  console.log('   - DB_HOST=localhost');
  console.log('   - DB_PORT=3306');
  console.log('   - DB_USERNAME=root');
  console.log('   - DB_PASSWORD=your_mysql_password');
  console.log('   - DB_NAME=bulak_smart_connect');
  console.log('');
  console.log('⏳ 4. Configure SMTP settings in .env:');
  console.log('   - SMTP_HOST=smtp.gmail.com');
  console.log('   - SMTP_PORT=587');
  console.log('   - SMTP_USER=your-email@gmail.com');
  console.log('   - SMTP_PASS=your-app-password');
  console.log('');
  console.log('⏳ 5. Set up Gmail App Password:');
  console.log('   - Enable 2FA on your Gmail account');
  console.log('   - Generate app password at: https://myaccount.google.com/apppasswords');
  console.log('   - Use the 16-character app password as SMTP_PASS');
  console.log('');
  console.log('⏳ 6. Start MinIO server:');
  console.log('   - Download MinIO from: https://min.io/download');
  console.log('   - Run: minio.exe server C:\\minio\\data --console-address ":9001"');
  console.log('   - Access console: http://localhost:9001');
  console.log('');
  console.log('⏳ 7. Test the complete system:');
  console.log('   - npm run start:dev');
  console.log('   - Visit: http://localhost:3000/api/docs');
  console.log('   - Test /auth/test-otp endpoint');
  console.log('   - Test forgot password flow in frontend');
  console.log('');
  console.log('🎉 Security system setup complete!');
  console.log('📚 Check README.md for detailed OTP integration guide');
}

// Run setup if called directly
if (require.main === module) {
  setupComplete();
}

module.exports = { setupComplete };