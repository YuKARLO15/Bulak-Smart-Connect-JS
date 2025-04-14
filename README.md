# Bulak LGU Smart Connect: Information and Queuing Management System
## How to Install (Frontend)

cd bulak-smart-connect-js </br>
npm install (optional) </br>
npm run dev </br>

## How to Install (Backend)

cd bsc-js-backend </br>
npm install or npm i -g @nestjs/cli (optional) </br>
npm run start </br>

Test at http://localhost:3000/ </br>

# Complementary Instructions After Revisions
## MySQL Setup

1. Download and install MySQL Installer from https://dev.mysql.com/downloads/installer/
- or https://dev.mysql.com/downloads/workbench/ </br>
2. During installation, select: </br>
- MySQL Server </br>
- MySQL Workbench </br>
- MySQL Shell </br>
- Connector/J </br>
- I selected all though </br>
3. Configure MySQL Server with these settings: </br>
- Authentication Method: Use Strong Password Encryption </br>
- Root Password: [create a secure password] </br>
4. Launch MySQL Workbench </br>
5. Create a new database: </br>

CREATE DATABASE bulak_smart_connect; </br>
USE bulak_smart_connect; </br>

-- Create users table </br>
CREATE TABLE users ( </br>
  id INT AUTO_INCREMENT PRIMARY KEY, </br>
  email VARCHAR(255) NOT NULL UNIQUE, </br>
  password VARCHAR(255) NOT NULL, </br>
  name VARCHAR(255) NOT NULL, </br>
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP </br>
); </br>

-- Create a test user (password: password123) </br>
INSERT INTO users (email, password, name) </br>
VALUES ('test@example.com', '$2b$10$mExcKUyHurlq1zNDNos9LOXbtUJZuvIKybmHr/BngC6ZamAjz1ohS', 'Test User'); </br>

-- Add roles table </br>
CREATE TABLE `roles` ( </br>
  `id` int NOT NULL AUTO_INCREMENT, </br>
  `name` varchar(50) NOT NULL, </br>
  `description` varchar(255), </br>
  PRIMARY KEY (`id`), </br>
  UNIQUE KEY `IDX_roles_name` (`name`) </br>
); </br>

-- Insert default roles </br>
INSERT INTO `roles` (name, description) VALUES </br>
('super_admin', 'Has all permissions and can manage other admins'), </br>
('admin', 'Can manage staff and citizens'), </br>
('staff', 'Can process applications and manage citizen requests'), </br>
('citizen', 'Regular user of the system'); </br>

-- Add user_roles table for role assignment </br>
CREATE TABLE `user_roles` ( </br>
  `user_id` int NOT NULL, </br>
  `role_id` int NOT NULL, </br>
  PRIMARY KEY (`user_id`, `role_id`), </br>
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE, </br>
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE </br>
); </br>

-- Add a default role column to users table for quick access </br>
ALTER TABLE `users` ADD COLUMN `default_role_id` int; </br>
ALTER TABLE `users` ADD CONSTRAINT `fk_users_roles` FOREIGN KEY (`default_role_id`) REFERENCES `roles` (`id`); </br>

-- Update existing users to be citizens by default </br>
UPDATE `users` SET `default_role_id` = (SELECT id FROM roles WHERE name = 'citizen'); </br>

-- Create a test admin (password: admin123) </br>
TBA </br>

Note: You can also import the database from the folder "database" </br>
Export it if you make any changes on the database and/or to ensure we have a backup to match the proper database on the latest iterations </br>
Also ensure there is no personal information on the database before you export it, for our safety. Optionally, you can just export it without the data, only the schema. </br>

## Environment Setup

Create a .env file in the bsc-js-backend directory with: </br>

DB_HOST=localhost </br>
DB_PORT=3306 </br>
DB_USERNAME=root </br>
DB_PASSWORD=your_password </br>
DB_NAME=bulak_smart_connect </br>
JWT_SECRET=your_jwt_secret_key </br>

Generate a secure JWT secret using: </br>

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" </br>

Optionally, you can retrieve the env file from our secure channel and put it in the bsc-js-backend directory </br>

## XAMPP Setup (Alternative to MySQL Installer/Optional)

If you prefer using XAMPP instead of MySQL Installer: </br>

1. Download and install XAMPP from https://www.apachefriends.org/ </br>
2. Start the MySQL and Apache services from XAMPP Control Panel </br>
3. Open phpMyAdmin at http://localhost/phpmyadmin </br>
4. Create database and tables as described in the MySQL Setup section </br>
5. Note that XAMPP uses MariaDB instead of MySQL, but this is compatible with the provided instructions </br>

## New Ways to Run Project

cd bulak-smart-connect-js </br>
npm run dev            # Run React and NestJS concurrently </br>
npm run start-frontend # Run React only </br>
npm run start-backend  # Run NestJS only </br>
npm run build          # Vite build </br>
npm run lint           # ESLint </br>
npm run preview        # Vite preview </br>

For more backend options: </br>

cd bsc-js-backend </br>
npm run start          # Start NestJS normally </br>
npm run start:dev      # Start NestJS in development mode </br>

# Old Instructions (Archived)
## Firebase Tools (Firebase Emulator)

npm install -g firebase-tools (can be skipped) </br>
cd bsc-js-backend </br>
firebase login </br>
firebase init emulators or firebase init (can be skipped) </br>
firebase emulators:start </br>

Test at http://127.0.0.1:4000/ </br>

install Java JDK from https://www.java.com/en/download/ and https://download.oracle.com/java/23/latest/jdk-23_windows-x64_bin.exe or https://www.oracle.com/java/technologies/downloads/ </br>

## serviceAccountKey

serviceAccountKey.json was ignored on git so if needed, just get it on our secure channel and put it on bsc-js-backend\src\config </br>

## npm run dev

npm run dev on the frontend folder now runs concurrently, meaning React, NestJs, & Firebase Emulator runs simultaneously </br>

If you want to run it on its default behavior, go to package.json on the folder, C:\Users\YuKARLO15\Desktop\Programming_Codes\Bulak-Smart-Connect-JS\bulak-smart-connect-js and change the dev under the scripts into "dev": "vite", </br>

## New Ways to Run Project (Mostly on Frontend Folder)

cd bulak-smart-connect-js </br>
npm run dev: will run React, NestJS (0n Dev Mode), and Firebase Emulator concurrently </br>
npm run start-frontend: will run React only </br>
npm run start-backend: will run NestJS (On Dev Mode) only </br>
npm run start-emulators: will run Firebase Emulators only </br>
npm run build: vite build </br>
npm run lint: eslint </br>
npm run preview: vite preview </br></br>
To further see other options, just enter "npm run" to see options for React and Concurrently</br>

For more options to run (mostly for Backend): </br>
cd bsc-js-backend </br>
npm run start: to start NestJS normally </br>
firebase emulators:start: to start Firebase emulator </br>
To further see other options, just enter "npm run" to see options for NestJS or "firebase" to see options for Firebase. </br>


