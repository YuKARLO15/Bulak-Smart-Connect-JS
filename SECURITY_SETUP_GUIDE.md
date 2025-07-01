# 🛡️ Security Setup Guide - Bulak Smart Connect

## 🚀 Quick Security Setup

### 1. Generate All Security Secrets
```bash
cd bsc-js-backend

# Generate both JWT and OTP secrets + setup environment
npm run setup-complete

# Or generate individually:
npm run generate-jwt-secret
npm run generate-otp-secret
```

### 2. Database Security
```sql
-- Create dedicated database user (recommended)
CREATE USER 'bulak_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON bulak_smart_connect.* TO 'bulak_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Email Security Setup
```bash
# Gmail App Password Setup:
# 1. Enable 2FA: https://myaccount.google.com/signinoptions/two-step-verification
# 2. Generate App Password: https://myaccount.google.com/apppasswords
# 3. Use app password (16 chars) as SMTP_PASS
```

### 4. MinIO Security
```bash
# Production MinIO setup
set MINIO_ROOT_USER=secure_username
set MINIO_ROOT_PASSWORD=secure_password_min_8_chars
minio.exe server C:\minio\data --console-address ":9001"
```

## 🔐 Security Checklist

### ✅ Authentication Security
- [x] **JWT Secrets**: 128-character cryptographically secure
- [x] **Password Hashing**: bcrypt with salt rounds
- [x] **OTP Security**: Time-limited, single-use verification
- [x] **Session Management**: Secure JWT token handling

### ✅ Database Security  
- [x] **Prepared Statements**: SQL injection prevention
- [x] **User Permissions**: Dedicated database user
- [x] **Connection Security**: Encrypted connections in production
- [x] **Data Validation**: Input sanitization and validation

### ✅ Email Security
- [x] **SMTP Authentication**: App passwords, not regular passwords
- [x] **Template Security**: No sensitive data in emails
- [x] **Rate Limiting**: Prevent email spam
- [x] **Professional Templates**: Anti-phishing measures

### ✅ File Upload Security
- [x] **File Type Validation**: Allowed extensions only
- [x] **Size Limits**: Prevent DoS attacks
- [x] **Secure Storage**: MinIO with access controls
- [x] **Virus Scanning**: Recommended for production

### ✅ API Security
- [x] **Rate Limiting**: Prevent abuse
- [x] **CORS Configuration**: Restricted origins
- [x] **Input Validation**: Comprehensive request validation
- [x] **Error Handling**: No sensitive data in error messages

## 🚨 Production Security

### Environment Security
```bash
# Use different secrets for each environment
# Development
JWT_SECRET=dev_secret_here
OTP_SECRET=dev_otp_secret_here

# Production  
JWT_SECRET=production_secret_completely_different
OTP_SECRET=production_otp_secret_different
```

### HTTPS Configuration
```bash
# Production requires HTTPS
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
SERVER_BASE_URL=https://api.yourdomain.com
```

### Monitoring & Logging
```bash
# Enable security logging in production
LOG_LEVEL=warn
LOG_SECURITY_EVENTS=true
MONITOR_FAILED_LOGINS=true
ALERT_ON_RATE_LIMIT=true
```

## 🔧 Testing Security

### Run Security Tests
```bash
# Test authentication security
npm run test:auth

# Test OTP security
npm run test:otp

# Run all security tests
npm run test:security
```

### Security Validation
```bash
# Validate JWT secret strength
node -e "console.log('JWT Secret Length:', process.env.JWT_SECRET?.length || 0)"

# Test OTP generation
curl -X POST http://localhost:3000/auth/test-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"security-test@example.com"}'
```

## 📊 Security Monitoring

### Metrics to Monitor
- **Failed Login Attempts**: Track suspicious activity
- **OTP Verification Rates**: Detect abuse patterns  
- **API Rate Limits**: Monitor endpoint usage
- **File Upload Patterns**: Detect malicious uploads
- **Email Delivery Failures**: SMTP security issues

### Alert Triggers
- Multiple failed login attempts from same IP
- Unusual OTP generation patterns
- Rate limit violations
- Database connection failures
- SMTP authentication failures

## 🛠️ Troubleshooting Security Issues

### JWT Token Issues
```javascript
// Debug JWT configuration
const jwt = require('jsonwebtoken');
console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
console.log('JWT Secret length:', process.env.JWT_SECRET?.length);
```

### OTP Issues
```javascript
// Debug OTP configuration
console.log('OTP Config:', {
  secret: !!process.env.OTP_SECRET,
  length: process.env.OTP_LENGTH,
  expiry: process.env.OTP_EXPIRY_MINUTES
});
```

### Database Security
```sql
-- Check user permissions
SHOW GRANTS FOR 'bulak_user'@'localhost';

-- Verify secure connection
SHOW STATUS LIKE 'Ssl_cipher';
```

---

**🔒 Security is paramount. Follow this guide completely before deploying to production.**