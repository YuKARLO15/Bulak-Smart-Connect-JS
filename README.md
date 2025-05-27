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
                <th colspan="5"><h3>Backend Technologies</h3></th>
            </tr>
            <tr>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg" alt="NestJS" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" alt="MySQL" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/socketio/socketio-original.svg" alt="Socket.IO" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/jest/jest-plain.svg" alt="Jest" width="60px" height="auto" /></td>
                <td><img src="https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg" alt="Swagger" width="60px" height="auto" /></td>
                <td><img src="https://min.io/resources/img/logo/minio-logo.svg" alt="MinIO" width="60px" height="auto" /></td>
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
                <th colspan="4"><h3>Additional Technologies</h3></th>
            </tr>
            <tr>
                <td><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="60px" height="auto" /></td>
                <td><img src="https://jwt.io/img/pic_logo.svg" alt="JWT" width="60px" height="auto" /></td>
                <td><img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" alt="TypeORM" width="60px" height="auto" /></td>
                <td><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Actions" width="60px" height="auto" /></td>
            </tr>
            <tr>
                <td><p><b>TypeScript</b></p></td>
                <td><p><b>JWT</b></p></td>
                <td><p><b>TypeORM</b></p></td>
                <td><p><b>GitHub Actions</b></p></td>
            </tr>
            <tr>
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
- **File Upload**: Support for multiple document types
- **Presigned URLs**: Secure file access with expiration

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
│   │   │   └── announcement/  # Announcements
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