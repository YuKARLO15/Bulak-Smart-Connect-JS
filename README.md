<div align="center">
  <img src="https://github.com/YuKARLO15/Bulak-Smart-Connect-JS/blob/main/bulak-smart-connect-js/src/LandingPageComponents/LandingPageAssets/BulakLGULogo.png?raw=true" width="20%" />
<h2>Bulak LGU Smart Connect</h2>
<p>Information and Queuing Management System</p>
</div>

## Technology Stack

### Frontend

- **React** - UI library for building component-based interfaces
- **Vite** - Fast build tool and development environment
- **Storybook** - Component documentation and UI development environment
- **React Router** - For application routing
- **Axios** - For API requests

### Backend

- **NestJS** - Progressive Node.js framework for server-side applications
- **TypeORM** - ORM for database interactions
- **JWT** - For secure authentication
- **MySQL** - Primary database

### DevOps & Documentation

- **GitHub Actions** - CI/CD workflows for testing and deployment
- **Storybook** - Component documentation
- **Compodoc** - API documentation

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
```

> [!note]
> You can also import the database from the folder "database" 
> Export it if you make any changes on the database and/or to ensure we have a backup to match the proper database on the latest iterations 
> Also ensure there is no personal information on the database before you export it, for our safety. Optionally, you can just export it without the data, only the schema.

## Environment Setup

Create a `.env` file in the bsc-js-backend directory with:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=bulak_smart_connect
JWT_SECRET=your_jwt_secret_key
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

