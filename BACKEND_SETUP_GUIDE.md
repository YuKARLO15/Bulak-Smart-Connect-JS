# 🔧 Backend Environment Setup Guide

## 📋 Step-by-Step Setup

### 1. Create Environment File
```bash
cd bsc-js-backend
cp .env.example .env
```

### 2. Configure Essential Variables
Edit your `.env` file with these REQUIRED settings:

```bash
# === ESSENTIAL CONFIGURATION ===
NODE_ENV=development
PORT=3000

# Database (Update with your MySQL credentials)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_actual_password
DB_NAME=bulak_smart_connect

# JWT Secret (Generate a secure one!)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters

# CORS & Frontend URL
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
WS_CORS_ORIGIN=http://localhost:5173

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=document-applications

#Queue Reset Configuration
QUEUE_RESET_TIMEZONE=Asia/Manila
QUEUE_RESET_TIME=23:59

# Email Configuration (if applicable)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# OTP Configuration
OTP_SECRET=your-super-secret-key-here
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
```

### 3. Generate Secure JWT Secret
```bash
# Run this command to generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste it as your `JWT_SECRET` value.

### 4. Database Setup
- Ensure MySQL is running on your system
- Create the database: `CREATE DATABASE bulak_smart_connect;`
- Update DB credentials in `.env`

### 5. MinIO Setup (Document Storage)
- Download and run MinIO server
- Default credentials: minioadmin/minioadmin123
- Server should run on http://localhost:9000

### 6. Start the Server
```bash
npm install
npm run start:dev
```

### 7. Verification
- ✅ Server running: http://localhost:3000
- ✅ Swagger docs: http://localhost:3000/api/docs
- ✅ Database connected (check console logs)
- ✅ MinIO connected (check console logs)

## 🔄 Environment Variables Reference

### Required Variables:
- `JWT_SECRET` - Must be 32+ characters
- `DB_PASSWORD` - Your actual MySQL password
- `WS_CORS_ORIGIN` - Frontend URL for WebSocket CORS

### Optional Variables (have defaults):
- `PORT` - Server port (default: 3000)
- `DB_HOST` - Database host (default: localhost)
- `MINIO_ENDPOINT` - MinIO server (default: localhost)

## 🚨 Common Issues & Solutions

### Database Connection Failed
```bash
# Check if MySQL is running
services.msc  # Windows
# OR
sudo systemctl status mysql  # Linux
```

### MinIO Connection Failed
```bash
# Start MinIO server
.\minio.exe server C:\minio\data --console-address ":9001"
```

### CORS Errors
- Ensure `FRONTEND_URL` and `WS_CORS_ORIGIN` match your frontend URL
- Update `ALLOWED_ORIGINS` if using different ports

## 🌍 Production Setup
For production, copy `.env.production.example` to `.env` and update:
- Use strong passwords
- Set `NODE_ENV=production`
- Use HTTPS URLs
- Configure secure MinIO credentials
