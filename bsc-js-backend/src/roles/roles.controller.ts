import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('admin', 'super_admin')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'super_admin')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Get('user/:userId')
  @Roles('admin', 'super_admin')
  getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(+userId);
  }
}
