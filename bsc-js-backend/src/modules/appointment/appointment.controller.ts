import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AppointmentStatus } from './entities/appointment.entity';
import { User } from '../../auth/decorators/user.decorator';
import { AuthenticatedUser } from '../../auth/jwt.strategy';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentController {
  private readonly logger = new Logger(AppointmentController.name);

  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @User() user: AuthenticatedUser,
  ) {
    // Set the userId from the authenticated user
    createAppointmentDto.userId = user.id;

    this.logger.log(`Creating appointment for user ${user.id}`);
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  @ApiOperation({ summary: 'Get all appointments (Admin/Staff only)' })
  async findAll() {
    this.logger.log('Fetching all appointments');
    return this.appointmentService.findAll();
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get user appointments' })
  async findUserAppointments(@User() user: AuthenticatedUser) {
    this.logger.log(`Fetching appointments for user ${user.id}`);
    return this.appointmentService.findAllByUser(user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  async getStats() {
    this.logger.log('Fetching appointment statistics');
    return this.appointmentService.getAppointmentsStats();
  }

  @Get('by-date')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  async getByDate(@Query('date') date: string) {
    if (!date) {
      throw new BadRequestException('Date parameter is required');
    }
    this.logger.log(`Fetching appointments for date: ${date}`);
    return this.appointmentService.getAppointmentsByDate(date);
  }

  @Get('date-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  async getByDateRange(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'Start and end date parameters are required',
      );
    }
    this.logger.log(`Fetching appointments from ${startDate} to ${endDate}`);
    return this.appointmentService.getAppointmentsByDateRange(
      startDate,
      endDate,
    );
  }

  @Get('available-slots')
  async getAvailableSlots(@Query('date') date: string) {
    if (!date) {
      throw new BadRequestException('Date parameter is required');
    }
    this.logger.log(`Fetching available slots for date: ${date}`);
    return this.appointmentService.getAvailableSlots(date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching appointment with ID: ${id}`);
    return this.appointmentService.findOne(+id);
  }

  @Get('by-number/:number')
  async findByAppointmentNumber(@Param('number') appointmentNumber: string) {
    this.logger.log(`Fetching appointment with number: ${appointmentNumber}`);
    return this.appointmentService.findByAppointmentNumber(appointmentNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @User() user: AuthenticatedUser,
  ) {
    // Get the appointment to check if it belongs to the user
    const appointment = await this.appointmentService.findOne(+id);

    // If not admin and not the appointment owner, don't allow update
    if (
      !user.roles.some((role) =>
        ['admin', 'staff', 'super_admin'].includes(role.name),
      ) &&
      appointment.userId !== user.id
    ) {
      throw new BadRequestException(
        'You do not have permission to update this appointment',
      );
    }

    this.logger.log(`Updating appointment with ID: ${id}`);
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff', 'super_admin')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
  ) {
    if (!Object.values(AppointmentStatus).includes(status)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${Object.values(AppointmentStatus).join(', ')}`,
      );
    }

    this.logger.log(
      `Updating status for appointment with ID: ${id} to ${status}`,
    );
    return this.appointmentService.updateStatus(+id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete appointment' })
  async remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    // Get the appointment to check if it belongs to the user
    const appointment = await this.appointmentService.findOne(+id);

    // If not admin and not the appointment owner, don't allow deletion
    if (
      !user.roles.some((role) =>
        ['admin', 'staff', 'super_admin'].includes(role.name),
      ) &&
      appointment.userId !== user.id
    ) {
      throw new BadRequestException(
        'You do not have permission to delete this appointment',
      );
    }

    this.logger.log(`Deleting appointment with ID: ${id}`);
    await this.appointmentService.remove(+id);
  }
}
