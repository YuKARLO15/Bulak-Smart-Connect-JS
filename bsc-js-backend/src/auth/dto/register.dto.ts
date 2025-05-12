export class RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  middleName?: string; // Optional
  lastName: string;
  name?: string; // Optional, due to the name field being optional in the User entity
}
