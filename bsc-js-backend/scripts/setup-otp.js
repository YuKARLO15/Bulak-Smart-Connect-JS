const fs = require('fs');
const path = require('path');
const { generateOTPSecret } = require('./generate-otp-secret');

/**
 * Quick setup script for OTP system
 */
function setupOTP() {
  console.log('🚀 Setting up OTP Email Verification System...\n');
  
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
  
  // Step 2: Generate OTP secret
  console.log('🔐 Generating OTP secret...');
  const otpSecret = generateOTPSecret();
  
  // Step 3: Update .env with OTP secret
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('OTP_SECRET=')) {
    envContent = envContent.replace(/OTP_SECRET=.*/, `OTP_SECRET=${otpSecret}`);
  } else {
    envContent += `\n# OTP Configuration\nOTP_SECRET=${otpSecret}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ OTP secret added to .env file\n');
  
  // Step 4: Setup checklist
  console.log('📋 SETUP CHECKLIST:');
  console.log('');
  console.log('1. ✅ OTP secret generated and added to .env');
  console.log('2. ⏳ Configure SMTP settings in .env:');
  console.log('   - SMTP_HOST=smtp.gmail.com');
  console.log('   - SMTP_PORT=587');
  console.log('   - SMTP_USER=your-email@gmail.com');
  console.log('   - SMTP_PASS=your-app-password');
  console.log('');
  console.log('3. ⏳ Set up Gmail App Password:');
  console.log('   - Enable 2FA on your Gmail account');
  console.log('   - Generate app password at: https://myaccount.google.com/apppasswords');
  console.log('   - Use the app password as SMTP_PASS');
  console.log('');
  console.log('4. ⏳ Test the system:');
  console.log('   - npm run start:dev');
  console.log('   - Visit: http://localhost:3000/api/docs');
  console.log('   - Test /auth/test-otp endpoint');
  console.log('');
  console.log('🎉 OTP system setup complete! Configure SMTP and you\'re ready to go.');
}

// Run setup if called directly
if (require.main === module) {
  setupOTP();
}

module.exports = { setupOTP };