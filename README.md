<div align="center">
  <img src="https://github.com/YuKARLO15/Bulak-Smart-Connect-JS/blob/main/bulak-smart-connect-js/src/LandingPageComponents/LandingPageAssets/BulakLGULogo.png?raw=true" width="20%" />
<h2>Bulak LGU Smart Connect</h2>
<p>Information and Queuing Management System</p>
</div>

## Technology Stack

<div align="center">
    <table>
        <tbody>
            <tr>
                <th colspan="4"><h3>Frontend Technologies</h3></th>
            </tr>
            <tr>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="60px" height="auto" /></td>
                <td><img src="https://vitejs.dev/logo.svg" alt="Vite" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/storybookjs/brand/master/icon/icon-storybook-default.svg" alt="Storybook" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/axios/axios-plain.svg" alt="Axios" width="60px" height="auto" /></td>
            </tr>
            <tr>
                <td><p><b>React</b></p></td>
                <td><p><b>Vite</b></p></td>
                <td><p><b>Storybook</b></p></td>
                <td><p><b>Axios</b></p></td>
            </tr>
            <tr>
                <td><p>UI library for building component-based interfaces</p></td>
                <td><p>Fast build tool and development environment</p></td>
                <td><p>Component documentation and UI development</p></td>
                <td><p>HTTP client for API requests</p></td>
            </tr>
        </tbody>
    </table>
</div>

<div align="center">
    <table>
        <tbody>
            <tr>
                <th colspan="6"><h3>Backend Technologies</h3></th>
            </tr>
            <tr>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg" alt="NestJS" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" alt="MySQL" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/socketio/socketio-original.svg" alt="Socket.IO" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/jest/jest-plain.svg" alt="Jest" width="60px" height="auto" /></td>
                <td><img src="https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg" alt="Swagger" width="60px" height="auto" /></td>
                <td><img src="https://github.com/minio/minio/raw/master/.github/logo.svg" alt="MinIO" width="60px" height="auto" /></td>
            </tr>
            <tr>
                <td><p><b>NestJS</b></p></td>
                <td><p><b>MySQL</b></p></td>
                <td><p><b>Socket.IO</b></p></td>
                <td><p><b>Jest</b></p></td>
                <td><p><b>Swagger</b></p></td>
                <td><p><b>MinIO</b></p></td>
            </tr>
            <tr>
                <td><p>Progressive Node.js framework</p></td>
                <td><p>Primary database</p></td>
                <td><p>Real-time communication</p></td>
                <td><p>Testing framework</p></td>
                <td><p>API documentation</p></td>
                <td><p>Object storage for documents</p></td>
            </tr>
        </tbody>
    </table>
</div>

<div align="center">
    <table>
        <tbody>
            <tr>
                <th colspan="5"><h3>Additional Technologies</h3></th>
            </tr>
            <tr>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="60px" height="auto" /></td>
                <td><img src="https://jwt.io/img/pic_logo.svg" alt="JWT" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" alt="TypeORM" width="60px" height="auto" /></td>
                <td><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Actions" width="60px" height="auto" /></td>
            </tr>
            <tr>
                <td><p><b>JavaScript</b></p></td>
                <td><p><b>TypeScript</b></p></td>
                <td><p><b>JWT</b></p></td>
                <td><p><b>TypeORM</b></p></td>
                <td><p><b>GitHub Actions</b></p></td>
            </tr>
            <tr>
                <td><p>Core programming language</p></td>
                <td><p>Type-safe JavaScript</p></td>
                <td><p>Secure authentication</p></td>
                <td><p>ORM for database interactions</p></td>
                <td><p>CI/CD workflows</p></td>
            </tr>
        </tbody>
    </table>
</div>

## Site Accessibility

- **Documentation Hub**: https://yukarlo15.github.io/Bulak-Smart-Connect-JS/
- **Component Documentation**: https://yukarlo15.github.io/Bulak-Smart-Connect-JS/frontend-docs/
- **API Documentation**: https://yukarlo15.github.io/Bulak-Smart-Connect-JS/api-docs/

## How to Install (Frontend)

```bash
cd bulak-smart-connect-js
npm install # (optional)
npm run dev
```

## How to Install (Backend)

```bash
cd bsc-js-backend
npm install # or
npm i -g @nestjs/cli # (optional)
npm run start
```

Test at [http://localhost:3000/](http://localhost:3000/)

## TypeORM Migrations for Production

```bash
#Install TypeORM CLI
npm install -g typeorm

#Generate a migration after making entity changes
typeorm migration:generate -n CreateUserRolesStructure

#Apply migrations
typeorm migration:run
```

## Complementary Instructions After Revisions

### MySQL Setup

1. Download and install MySQL Installer from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/) or [https://dev.mysql.com/downloads/workbench/](https://dev.mysql.com/downloads/workbench/)

2. During installation, select:

- MySQL Server
- MySQL Workbench
- MySQL Shell
- Connector/J

> I selected all though

3. Configure MySQL Server with these settings:

- Authentication Method: Use Strong Password Encryption
- Root Password: `[create a secure password]`
4. Launch MySQL Workbench
5. Create a new database:

```sql
CREATE DATABASE bulak_smart_connect; 
USE bulak_smart_connect; 

-- Create users table 
CREATE TABLE users ( 
  id INT AUTO_INCREMENT PRIMARY KEY, 
  email VARCHAR(255) NOT NULL UNIQUE, 
  password VARCHAR(255) NOT NULL, 
  name VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Create a test user (password: password123) 
INSERT INTO users (email, password, name) 
VALUES ('test@example.com', '$2b$10$mExcKUyHurlq1zNDNos9LOXbtUJZuvIKybmHr/BngC6ZamAjz1ohS', 'Test User'); 

-- Add roles table 
CREATE TABLE `roles` ( 
  `id` int NOT NULL AUTO_INCREMENT, 
  `name` varchar(50) NOT NULL, 
  `description` varchar(255), 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `IDX_roles_name` (`name`) 
); 

-- Insert default roles 
INSERT INTO `roles` (name, description) VALUES 
('super_admin', 'Has all permissions and can manage other admins'), 
('admin', 'Can manage staff and citizens'), 
('staff', 'Can process applications and manage citizen requests'), 
('citizen', 'Regular user of the system'); 

-- Add user_roles table for role assignment 
CREATE TABLE `user_roles` ( 
  `user_id` int NOT NULL, 
  `role_id` int NOT NULL, 
  PRIMARY KEY (`user_id`, `role_id`), 
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE, 
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE 
); 

-- Add a default role column to users table for quick access 
ALTER TABLE `users` ADD COLUMN `default_role_id` int; 
ALTER TABLE `users` ADD CONSTRAINT `fk_users_roles` FOREIGN KEY (`default_role_id`) REFERENCES `roles` (`id`); 

-- Update existing users to be citizens by default 
UPDATE `users` SET `default_role_id` = (SELECT id FROM roles WHERE name = 'citizen'); 

-- Create a test admin (password: admin123) 
INSERT INTO users (email, password, name) 
VALUES ('admin@example.com', '$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq', 'Admin User'); 

-- Create test super admin 
INSERT INTO users (email, password, name)  
VALUES ('superadmin@example.com', '$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq', 'Super Admin User'); 

-- Create test staff 
INSERT INTO users (email, password, name)  
VALUES ('staff@example.com', '$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq', 'Staff User'); 

-- Assign appropriate roles 
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@example.com' AND r.name = 'admin'; 

INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'superadmin@example.com' AND r.name = 'super_admin'; 

INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'staff@example.com' AND r.name = 'staff'; 

-- Set default roles 
UPDATE users u JOIN roles r ON r.name = 'admin' 
SET u.default_role_id = r.id 
WHERE u.email = 'admin@example.com'; 

UPDATE users u JOIN roles r ON r.name = 'super_admin' 
SET u.default_role_id = r.id 
WHERE u.email = 'superadmin@example.com'; 

UPDATE users u JOIN roles r ON r.name = 'staff' 
SET u.default_role_id = r.id 
WHERE u.email = 'staff@example.com'; 

-- Additional tables for the complete system
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE queues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  queue_number VARCHAR(20) NOT NULL,
  user_id INT,
  department VARCHAR(100) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  status ENUM('waiting', 'serving', 'completed', 'cancelled') DEFAULT 'waiting',
  priority_level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  called_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

> [!note]
> You can also import the database from the folder "database" 
> Export it if you make any changes on the database and/or to ensure we have a backup to match the proper database on the latest iterations 
> Also ensure there is no personal information on the database before you export it, for our safety. Optionally, you can just export it without the data, only the schema.

### MinIO Setup

MinIO is an object storage solution used for storing and managing document files in the application.

#### Option 1: Docker Installation (Recommended)

1. **Install Docker** (if not already installed):
   - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Install and start Docker Desktop

2. **Run MinIO using Docker**:
```bash
# Create a directory for MinIO data (optional)
mkdir -p ~/minio/data

# Run MinIO container
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -v ~/minio/data:/data \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  quay.io/minio/minio server /data --console-address ":9001"
```

3. **Access MinIO Console**:
   - Navigate to [http://localhost:9001](http://localhost:9001)
   - Login with:
     - **Username**: `minioadmin`
     - **Password**: `minioadmin123`

#### Option 2: Windows Binary Installation

1. **Download MinIO**:
   - Go to [https://min.io/download](https://min.io/download)
   - Download the Windows binary (`minio.exe`)
   - Or use PowerShell to download directly:
   ```powershell
   # Open PowerShell as Administrator
   Invoke-WebRequest -Uri "https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -OutFile "minio.exe"
   ```

2. **Create MinIO directory and setup**:
```cmd
# Create directory structure
mkdir C:\minio
mkdir C:\minio\data

# Move the downloaded minio.exe to C:\minio\
# Or download directly to the directory:
cd C:\minio
```

If using PowerShell to download directly to the correct location:
```powershell
# Create directory and download in one go
New-Item -ItemType Directory -Force -Path "C:\minio"
New-Item -ItemType Directory -Force -Path "C:\minio\data"
Invoke-WebRequest -Uri "https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -OutFile "C:\minio\minio.exe"
```

3. **Create a startup batch file** (Recommended for easy management):

Create a file named `start-minio.bat` in `C:\minio\` with the following content:
```batch
@echo off
REM MinIO Server Startup Script
REM Place this file in C:\minio\start-minio.bat

echo ===============================================
echo Starting MinIO Object Storage Server
echo ===============================================

REM Set MinIO credentials (change these for production)
set MINIO_ROOT_USER=minioadmin
set MINIO_ROOT_PASSWORD=minioadmin123

REM Optional: Set additional MinIO configurations
set MINIO_CONSOLE_ADDRESS=:9001

echo.
echo MinIO Configuration:
echo - API Server: http://localhost:9000
echo - Web Console: http://localhost:9001
echo - Username: %MINIO_ROOT_USER%
echo - Password: %MINIO_ROOT_PASSWORD%
echo.
echo Starting server...
echo (Press Ctrl+C to stop the server)
echo.

REM Start MinIO server
minio.exe server C:\minio\data --console-address ":9001"

echo.
echo MinIO server has stopped.
pause
```

4. **Start MinIO Server**:

**Method 1: Using the batch file (Recommended)**
```cmd
# Double-click start-minio.bat or run from command prompt:
cd C:\minio
start-minio.bat
```

**Method 2: Manual command line**
```cmd
cd C:\minio
set MINIO_ROOT_USER=minioadmin
set MINIO_ROOT_PASSWORD=minioadmin123
minio.exe server C:\minio\data --console-address ":9001"
```

**Method 3: Using PowerShell**
```powershell
cd C:\minio
$env:MINIO_ROOT_USER = "minioadmin"
$env:MINIO_ROOT_PASSWORD = "minioadmin123"
.\minio.exe server C:\minio\data --console-address ":9001"
```

#### Option 3: Using XAMPP/Alternative Setup

If you're using XAMPP or prefer a different approach:

1. Follow Option 1 (Docker) as it's platform-independent
2. Alternatively, use MinIO's Windows Service installer from their official website

#### (Optional) Install the MinIO Client

The MinIO Client allows you to work with your MinIO volume from the command line for advanced operations.

1. **Download MinIO Client**:
   - Download from: [https://dl.min.io/client/mc/release/windows-amd64/mc.exe](https://dl.min.io/client/mc/release/windows-amd64/mc.exe)
   - Or use PowerShell:
   ```powershell
   # Download to C:\minio\ directory
   Invoke-WebRequest -Uri "https://dl.min.io/client/mc/release/windows-amd64/mc.exe" -OutFile "C:\minio\mc.exe"
   ```

2. **Set up MinIO Client**:
```cmd
# Navigate to MinIO directory
cd C:\minio

# Test the client
mc.exe --help
```

3. **Configure MinIO Client alias**:
```cmd
# Set up alias for your local MinIO instance
mc.exe alias set local http://127.0.0.1:9000 minioadmin minioadmin123

# Test the connection
mc.exe admin info local
```

4. **Common MinIO Client Commands**:
```cmd
# List buckets
mc.exe ls local

# Create a bucket
mc.exe mb local/my-new-bucket

# List files in a bucket
mc.exe ls local/document-applications

# Copy files
mc.exe cp myfile.pdf local/document-applications/

# Get bucket policy
mc.exe policy get local/document-applications
```

#### Post-Installation Setup

1. **Verify Installation**:
   - MinIO API: [http://localhost:9000](http://localhost:9000)
   - MinIO Console: [http://localhost:9001](http://localhost:9001)

2. **Create Bucket** (if not auto-created):
   - **Option A: Using Web Console**
     - Login to MinIO Console
     - Click "Create Bucket"
     - Name: `document-applications` (or as specified in your `.env`)
     - Set to public read if needed
   
   - **Option B: Using MinIO Client (if installed)**
   ```cmd
   mc.exe mb local/document-applications
   ```

3. **Update Environment Variables**:
   ```bash
   # In your .env file
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_USE_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin123
   MINIO_BUCKET_NAME=document-applications
   ```

#### Troubleshooting

- **Port Conflicts**: If port 9000 is in use, change to a different port:
  ```bash
  # For Docker
  docker run -d -p 9002:9000 -p 9003:9001 --name minio ...
  
  # For Windows Binary - update your batch file:
  minio.exe server C:\minio\data --address ":9002" --console-address ":9003"
  
  # Update .env file
  MINIO_PORT=9002
  ```

- **Permission Issues**: 
  - Ensure the data directory has proper read/write permissions
  - Run Command Prompt as Administrator if needed
  - Check Windows Defender/Antivirus isn't blocking minio.exe

- **Docker Issues**: 
  ```bash
  # Stop existing container
  docker stop minio
  docker rm minio
  
  # Run new container
  docker run -d ...
  ```

- **Windows Binary Issues**:
  ```cmd
  # Check if MinIO is running
  netstat -an | findstr :9000
  
  # Kill existing MinIO process if needed
  taskkill /f /im minio.exe
  
  # Restart using batch file
  start-minio.bat
  ```

- **MinIO Client Issues**:
  ```cmd
  # Test client connectivity
  mc.exe admin info local
  
  # Re-configure alias if needed
  mc.exe alias remove local
  mc.exe alias set local http://127.0.0.1:9000 minioadmin minioadmin123
  ```

- **Connection Testing**: The backend will automatically test MinIO connection on startup and provide helpful error messages.

#### Production Considerations

For production environments, consider:

1. **Change Default Credentials**:
   ```batch
   # In start-minio.bat, update:
   set MINIO_ROOT_USER=your_secure_username
   set MINIO_ROOT_PASSWORD=your_secure_password_min_8_chars
   ```

2. **Use HTTPS/TLS**:
   ```batch
   # Add certificates and update:
   set MINIO_USE_SSL=true
   minio.exe server C:\minio\data --certs-dir C:\minio\certs --console-address ":9001"
   ```

3. **Run as Windows Service**: Consider using tools like NSSM (Non-Sucking Service Manager) to run MinIO as a Windows service.

4. **Backup Strategy**: Regularly backup your `C:\minio\data` directory.
```

## Environment Setup

Create a `.env` file in the bsc-js-backend directory with:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=bulak_smart_connect

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=your_password
MINIO_BUCKET_NAME=bulak-smart-connect
FILE_STORAGE_TYPE=minio
```

Generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Optionally, you can retrieve the env file from our secure channel and put it in the bsc-js-backend directory 

## XAMPP Setup (Alternative to MySQL Installer/Optional)

If you prefer using XAMPP instead of MySQL Installer:

1. Download and install XAMPP from https://www.apachefriends.org/
2. Start the MySQL and Apache services from XAMPP Control Panel
3. Open phpMyAdmin at http://localhost/phpmyadmin
4. Create database and tables as described in the MySQL Setup section
5. Note that XAMPP uses MariaDB instead of MySQL, but this is compatible with the provided instructions

## New Ways to Run Project

```bash
cd bulak-smart-connect-js
npm run dev            # Run React and NestJS concurrently
npm run start-frontend # Run React only
npm run start-backend  # Run NestJS only
npm run build          # Vite build
npm run lint           # ESLint
npm run preview        # Vite preview
```

For more backend options:

```bash
cd bsc-js-backend
npm run start          # Start NestJS normally
npm run start:dev      # Start NestJS in development mode
```

## Development Scripts

### Frontend (bulak-smart-connect-js)
```bash
npm run dev            # Run React with Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run storybook      # Start Storybook
npm run build-storybook # Build Storybook
```

### Backend (bsc-js-backend)
```bash
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start in debug mode
npm run build          # Build TypeScript
npm run test           # Run tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
```

### Full Stack Development
```bash
# From root directory
npm run dev            # Run both frontend and backend concurrently
npm run start-frontend # Run React only  
npm run start-backend  # Run NestJS only
```

## Testing

### Backend Tests
```bash
cd bsc-js-backend
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:cov            # Run tests with coverage
npm run test:e2e            # Run end-to-end tests
```

### Test Coverage
- ✅ Authentication & Authorization
- ✅ User Management & Roles
- ✅ Queue Management System
- ✅ Appointment Scheduling
- ✅ Announcements
- ✅ Document Applications with MinIO Storage
- ✅ Real-time WebSocket Gateway

All modules include both unit tests and controller tests with proper mocking.

## API Documentation

### Swagger/OpenAPI Documentation
- **Local Development**: http://localhost:3000/api/docs
- **Interactive API Testing**: Available through Swagger UI
- **JWT Authentication**: Supported in Swagger interface

### Additional Documentation
- **Postman Collection**: [`/docs/bulak-smart-connect-postman-collection.json`](bsc-js-backend/docs/bulak-smart-connect-postman-collection.json)
- **User Management Guide**: [`/docs/user-management-api.md`](bsc-js-backend/docs/user-management-api.md)
- **User Update Guide**: [`/docs/user-update-readme.md`](bsc-js-backend/docs/user-update-readme.md)

### API Testing
```bash
# Start the backend server
cd bsc-js-backend
npm run start:dev

# Access Swagger documentation at:
# http://localhost:3000/api/docs
```

### Using Swagger UI
1. Start your backend server (`npm run start:dev`)
2. Navigate to http://localhost:3000/api/docs
3. Use the "Authorize" button to add your JWT token
4. Test endpoints directly from the interface

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/update-profile` - Update user profile

### Queue Management
- `GET /queue` - Get all queues
- `POST /queue/join` - Join a queue
- `DELETE /queue/leave` - Leave a queue
- WebSocket events for real-time updates

### Appointments
- `GET /appointment` - Get appointments
- `POST /appointment` - Create appointment
- `PATCH /appointment/:id` - Update appointment

### Announcements
- `GET /announcements` - Get all announcements
- `GET /announcements/recent` - Get recent announcements

### Document Applications
- `GET /document-applications` - Get user's applications
- `POST /document-applications` - Create new application
- `POST /document-applications/:id/upload` - Upload document file
- `GET /document-applications/files/:fileId/download` - Get file download URL
- `PATCH /document-applications/:id` - Update application
- `PATCH /document-applications/:id/status` - Update application status (Admin only)
- `DELETE /document-applications/:id` - Delete application

### File Storage
- **MinIO Integration**: Secure document storage and retrieval
- **File Upload**: Support for multiple document types (PDF, Images)
- **Presigned URLs**: Secure file access with expiration
- **Automatic Bucket Management**: Auto-creation and configuration

For complete API documentation, check the Postman collection in `/docs/bulak-smart-connect-postman-collection.json`

## Test Accounts

The system comes with pre-configured test accounts:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `test@example.com` | `password123` | citizen | Regular user account |
| `admin@example.com` | `admin123` | admin | Administrator account |
| `superadmin@example.com` | `admin123` | super_admin | Super administrator |
| `staff@example.com` | `admin123` | staff | Staff member account |

All passwords are hashed using bcrypt for security.

## Project Structure

```
Bulak-Smart-Connect-JS/
├── bulak-smart-connect-js/     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── LandingPageComponents/ # Landing page specific
│   │   └── ...
│   └── package.json
├── bsc-js-backend/            # NestJS backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── roles/             # Role management
│   │   ├── modules/
│   │   │   ├── queue/         # Queue management
│   │   │   ├── appointment/   # Appointment system
│   │   │   ├── announcement/  # Announcements
│   │   │   └── document-applications/ # Document applications with MinIO
│   │   └── main.ts
│   ├── test/                  # E2E tests
│   ├── docs/                  # API documentation
│   └── package.json
└── README.md
```

# Authors

<div align="center">
    <table>
        <tbody>
            <tr>
                <td><img src="https://github.com/YuKARLO15.png" alt="YuKARLO15 user profile" width="100px" height="auto" /></td>
                <td><img src="https://github.com/dennissegailfrancisco.png" alt="dennissegailfrancisco user profile" width="100px" height="auto" /></td>
                <td><img src="https://github.com/jhazminereigne.png" alt="jhazminereigne user profile" width="100px" height="auto" /></td>
                <td><img src="https://github.com/Astriaaa.png" alt="Astriaaa user profile" width="100px" height="auto" /></td>
            </tr>
            <tr>
                <td><p><b><a href="https://github.com/YuKARLO15">YuKARLO15</a></b></p></td>
                <td><p><b><a href="https://github.com/dennissegailfrancisco">dennissegailfrancisco</a></b></p></td>
                <td><p><b><a href="https://github.com/jhazminereigne">jhazminereigne</a></b></p></td>
                <td><p><b><a href="https://github.com/Astriaaa">Astriaaa</a></b></p></td>
            </tr>
            <tr>
                <td><p>BS Computer Science</p></td>
                <td><p>BS Information Technology</p></td>
                <td><p>BS Computer Science</p></td>
                <td><p>BS Information Technology</p></td>
            </tr>
        </tbody>
    </table>
</div>