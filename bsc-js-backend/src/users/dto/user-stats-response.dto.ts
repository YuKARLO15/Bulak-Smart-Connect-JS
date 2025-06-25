import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

class UsersByRoleDto {
  @ApiProperty({
    example: 'citizen',
    description: 'Role name',
  })
  roleName: string;

  @ApiProperty({
    example: 25,
    description: 'Number of users with this role',
  })
  count: number;
}

export class UserStatsResponseDto {
  @ApiProperty({
    example: 100,
    description: 'Total number of users',
  })
  totalUsers: number;

  @ApiProperty({
    example: 85,
    description: 'Number of active users',
  })
  activeUsers: number;

  @ApiProperty({
    example: 15,
    description: 'Number of inactive users',
  })
  inactiveUsers: number;

  @ApiProperty({
    type: [UsersByRoleDto],
    description: 'User count by role',
  })
  usersByRole: UsersByRoleDto[];

  @ApiProperty({
    type: [UserResponseDto],
    description: 'Recently created users',
  })
  recentUsers: UserResponseDto[];
}
