import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Username',
  })
  username?: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  firstName: string;

  @ApiPropertyOptional({
    example: 'Miguel',
    description: 'User middle name',
  })
  middleName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  lastName: string;

  @ApiProperty({
    example: 'John Miguel Doe',
    description: 'Full name',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Jr.',
    description: 'Name extension',
  })
  nameExtension?: string;

  @ApiProperty({
    example: '+639123456789',
    description: 'Contact number',
  })
  contactNumber: string;

  @ApiProperty({
    example: true,
    description: 'User active status',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'User last update date',
  })
  updatedAt: Date;

  @ApiProperty({
    example: ['citizen', 'staff'],
    description: 'User roles',
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    example: 'citizen',
    description: 'Default role name',
  })
  defaultRole: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Default role ID',
  })
  defaultRoleId?: number;
}
