# ⚡ Quick Commands Reference - Bulak Smart Connect

## 🚀 **Initial Setup Commands**

```bash
# Complete security setup
cd bsc-js-backend
npm run setup-complete

# Frontend setup
cd bulak-smart-connect-js
cp .env.example .env
npm install
npm run dev

# Backend setup
cd bsc-js-backend
cp .env.example .env
npm install
npm run start:dev
```

## 🔐 **Security Commands**

```bash
# Generate JWT secret
npm run generate-jwt-secret

# Generate OTP secret  
npm run generate-otp-secret

# Run security tests
npm run test:security
npm run test:auth
npm run test:otp
```

## 🧪 **Testing Commands**

```bash
# Backend tests
npm test                    # All tests
npm run test:cov           # With coverage
npm run test:e2e           # End-to-end tests
npm run test:watch         # Watch mode

# Specific test suites
npm run test:unit          # Unit tests only
npm run test:auth          # Authentication tests
npm run test:otp           # OTP system tests
```

## 🔧 **Development Commands**

```bash
# Start development servers
npm run dev                # Both frontend and backend
npm run start-frontend     # Frontend only
npm run start-backend      # Backend only

# Build commands
npm run build              # Frontend build
npm run preview            # Preview build

# Code quality
npm run lint               # ESLint check
npm run format             # Prettier format
```

## 📊 **Database Commands**

```bash
# Database operations
npm run migration:generate # Generate migration
npm run migration:run      # Apply migrations
npm run migration:revert   # Revert migration

# Database reset (development)
npm run db:reset           # Reset database
npm run db:seed            # Seed test data
```

## 📚 **Documentation Commands**

```bash
# Generate documentation
npm run docs:generate      # Generate API docs
npm run storybook          # Start Storybook
npm run build-storybook    # Build Storybook

# View documentation
open http://localhost:3000/api/docs  # Swagger docs
open http://localhost:6006           # Storybook
```

## 🌐 **Production Commands**

```bash
# Production build
NODE_ENV=production npm run build

# Production start
NODE_ENV=production npm start

# Health checks
curl http://localhost:3000/health
curl http://localhost:3000/api/docs
```

## 🔍 **Debug Commands**

```bash
# Debug mode
npm run start:debug        # Start in debug mode

# Check configurations
node -e "console.log('JWT:', !!process.env.JWT_SECRET)"
node -e "console.log('OTP:', !!process.env.OTP_SECRET)"
node -e "console.log('DB:', process.env.DB_NAME)"

# Test API endpoints
curl -X POST http://localhost:3000/auth/test-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 📈 **Monitoring Commands**

```bash
# Check server status
curl http://localhost:3000/health

# Monitor logs
tail -f logs/app.log

# Check database connection
npm run db:check

# Monitor MinIO
curl http://localhost:9000/minio/health/live
```

## 🚨 **Emergency Commands**

```bash
# Stop all services
pkill -f "node.*3000"     # Stop backend
pkill -f "node.*5173"     # Stop frontend

# Reset everything
npm run clean             # Clean builds
npm run fresh-install     # Fresh npm install
npm run db:reset          # Reset database

# Check ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5173
netstat -tulpn | grep :9000
```

---

**💡 Tip: Bookmark this page for quick reference during development!**