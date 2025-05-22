# User Management API Documentation

## Authentication Endpoints

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "emailOrUsername": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "access_token": "string",
    "user": {
      "id": "number",
      "email": "string",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "name": "string",
      "roles": ["string"],
      "defaultRole": "string"
    }
  }
  ```

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "username": "string",
    "password": "string",
    "firstName": "string",
    "middleName": "string (optional)",
    "lastName": "string",
    "nameExtension": "string (optional)",
    "contactNumber": "string (optional)"
  }
  ```
- **Response**: 
  ```json
  {
    "access_token": "string",
    "user": {
      "id": "number",
      "email": "string",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "name": "string",
      "roles": ["citizen"],
      "defaultRole": "citizen"
    }
  }
  ```

### Get User Profile
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Authentication**: Bearer Token
- **Response**: 
  ```json
  {
    "id": "number",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "nameExtension": "string",
    "contactNumber": "string",
    "name": "string",
    "roles": ["string"],
    "defaultRole": "string"
  }
  ```

## User Update Endpoints

### Update User Profile (Citizen)
- **URL**: `/auth/update-profile`
- **Method**: `POST`
- **Authentication**: Bearer Token
- **Description**: Allows users to update their own profile information
- **Body**:
  ```json
  {
    "email": "string (optional)",
    "username": "string (optional)",
    "password": "string (optional, min 8 chars)",
    "firstName": "string (optional)",
    "middleName": "string (optional)",
    "lastName": "string (optional)",
    "nameExtension": "string (optional)",
    "contactNumber": "string (optional)",
    "address": "string (optional)"
  }
  ```
- **Response**: Updated user object
  ```json
  {
    "id": "number",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "nameExtension": "string",
    "contactNumber": "string",
    "name": "string",
    "roles": ["string"],
    "defaultRole": "string"
  }
  ```

### Admin Update User (Admin only)
- **URL**: `/auth/admin/update-user/:userId`
- **Method**: `POST`
- **Authentication**: Bearer Token with admin/super_admin role
- **Description**: Allows administrators to update any user's information including role assignments
- **Body**:
  ```json
  {
    "email": "string (optional)",
    "username": "string (optional)",
    "password": "string (optional, min 8 chars)",
    "firstName": "string (optional)",
    "middleName": "string (optional)",
    "lastName": "string (optional)",
    "nameExtension": "string (optional)",
    "contactNumber": "string (optional)",
    "address": "string (optional)",
    "defaultRoleId": "number (optional)",
    "roleIds": ["number (optional)"]
  }
  ```
- **Response**: Updated user object
  ```json
  {
    "id": "number",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "nameExtension": "string",
    "contactNumber": "string",
    "name": "string",
    "roles": ["string"],
    "defaultRole": "string"
  }
  ```

## Error Responses

### Common Error Response Format
```json
{
  "statusCode": "number",
  "message": "string",
  "error": "string (optional)"
}
```

### Common Error Status Codes
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., email already exists)
- **500 Internal Server Error**: Server error
