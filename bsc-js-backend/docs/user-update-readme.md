# Bulak Smart Connect - User Management API

## Overview
This module provides comprehensive functionality for user management in the Bulak Smart Connect system, including registration, authentication, profile updates, and role-based access control.

## Key Features
- User registration with validation
- Authentication with JWT tokens
- Profile management for citizens
- Admin capabilities for user management
- Role-based access control
- Robust error handling
- Comprehensive validation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd bsc-js-backend
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   JWT_SECRET=your_secret_key
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=bsc_db
   ```

### Running the Application
```bash
npm run start:dev
```

### API Documentation
Access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Implementation Details

### DTOs and Validation
The system uses two primary Data Transfer Objects for user updates:

1. **UpdateUserDto**: For regular citizens to update their own profiles
   - Email, username, password (with validation)
   - Personal information (name, contact details)
   - Does not include role management

2. **AdminUpdateUserDto**: Extends the base DTO with admin capabilities
   - Inherits all fields from UpdateUserDto
   - Adds role management (roleIds, defaultRoleId)

All fields are validated using class-validator decorators:
- Email format validation
- Password length requirements (minimum 8 characters)
- Data type validation

### Role Management
- Users can have multiple roles (citizen, admin, etc.)
- Each user has one default role
- Roles are stored in a many-to-many relationship
- Admin can assign multiple roles to users
- Default role must be one of the assigned roles

### Error Handling
The implementation includes robust error handling for:
- Database operation failures
- Validation errors
- Permission checks
- Conflict detection (duplicate emails/usernames)
- TypeORM operation errors

### Security Features
- JWT authentication required for all update endpoints
- Role-based authorization for admin endpoints
- Password hashing with bcrypt
- Input validation to prevent security vulnerabilities

## Testing the User Update Functionality

### 1. Regular User Update Profile

Test a citizen updating their own profile:

```bash
# First, login to get a token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername": "citizen@example.com", "password": "password123"}'

# Use the returned token to update profile
curl -X POST http://localhost:3000/auth/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Citizen",
    "contactNumber": "1234567890"
  }'
```

### 2. Admin Update User

Test an admin updating another user's profile:

```bash
# First, login as admin to get a token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername": "admin@example.com", "password": "password123"}'

# Use the returned token to update another user
curl -X POST http://localhost:3000/auth/admin/update-user/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "Updated",
    "roleIds": [1, 2],
    "defaultRoleId": 2
  }'
```

### Error Handling Examples

#### Invalid Email Format
```bash
curl -X POST http://localhost:3000/auth/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email"
  }'
```
Response:
```json
{
  "statusCode": 400,
  "message": "Invalid email format",
  "error": "Bad Request"
}
```

#### Setting Invalid Default Role
```bash
curl -X POST http://localhost:3000/auth/admin/update-user/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "defaultRoleId": 2
  }'
```
Response (if user doesn't have role 2):
```json
{
  "statusCode": 400,
  "message": "Cannot set default role to a role the user does not have",
  "error": "Bad Request"
}
```

### Running End-to-End Tests

The system includes comprehensive end-to-end tests for user update functionality:

```bash
npm run test:e2e
```

This will run all tests, including the user update functionality tests that cover:
- Basic profile updates
- Role management
- Permission validation
- Error handling
- Edge cases

## Security Considerations

- JWT tokens expire after a certain period
- Password hashing using bcrypt
- Role-based access control for admin features
- Input validation on all endpoints

## Additional Documentation

For more detailed API documentation, please refer to:
- [User Management API Documentation](../docs/user-management-api.md)
