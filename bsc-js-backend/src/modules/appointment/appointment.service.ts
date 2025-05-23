import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  format,
  addDays,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
} from 'date-fns';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      // Check date validity
      const date = parseISO(createAppointmentDto.appointmentDate);
      if (!isValid(date)) {
        throw new BadRequestException('Invalid appointment date');
      }

      // Check if date is a weekend
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        throw new BadRequestException('Cannot book appointments on weekends');
      }

      // Check if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new BadRequestException('Cannot book appointments in the past');
      }

      // Generate appointment number with date prefix
      const dateStr = format(date, 'yyyyMMdd');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      const appointmentNumber = `APPT-${dateStr}-${randomSuffix}`;

      // Check if time slot is available
      await this.checkTimeSlotAvailability(
        createAppointmentDto.appointmentDate,
        createAppointmentDto.appointmentTime,
      );

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        appointmentNumber,
      });

      const savedAppointment =
        await this.appointmentRepository.save(appointment);
      console.log('Created new appointment:', savedAppointment);
      return savedAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      order: {
        appointmentDate: 'ASC',
        appointmentTime: 'ASC',
      },
    });
  }

  async findAllByUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { userId },
      order: {
        appointmentDate: 'DESC',
        appointmentTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByAppointmentNumber(
    appointmentNumber: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointmentNumber },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${appointmentNumber} not found`);
    }

    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const appointment = await this.findOne(id);

      // If changing date or time, check availability
      if (
        updateAppointmentDto.appointmentDate ||
        updateAppointmentDto.appointmentTime
      ) {
        const newDate =
          updateAppointmentDto.appointmentDate || appointment.appointmentDate;
        const newTime =
          updateAppointmentDto.appointmentTime || appointment.appointmentTime;

        if (
          newDate !== appointment.appointmentDate ||
          newTime !== appointment.appointmentTime
        ) {
          await this.checkTimeSlotAvailability(newDate, newTime);
        }
      }

      // Update the appointment
      const updated = Object.assign(appointment, updateAppointmentDto);
      console.log(`Updated appointment ${id}:`, updated);
      return this.appointmentRepository.save(updated);
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.appointmentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      console.log(`Deleted appointment ${id}`);
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    try {
      const appointment = await this.findOne(id);
      appointment.status = status;
      console.log(`Updated status for appointment ${id} to ${status}`);
      return this.appointmentRepository.save(appointment);
    } catch (error) {
      console.error(`Error updating status for appointment ${id}:`, error);
      throw error;
    }
  }

  async getAvailableSlots(date: string): Promise<string[]> {
    try {
      // Parse the date
      const parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        throw new BadRequestException('Invalid date format');
      }

      // Get all appointments for the specified date
      const existingAppointments = await this.appointmentRepository.find({
        where: {
          appointmentDate: date,
          status: AppointmentStatus.PENDING || AppointmentStatus.CONFIRMED,
        },
        select: ['appointmentTime'],
      });

      const bookedSlots = existingAppointments.map(
        (app) => app.appointmentTime,
      );

      // Generate all time slots (8:00 AM - 5:00 PM with 30min intervals)
      const allTimeSlots = this.generateAllTimeSlots();

      // Return only available slots
      return allTimeSlots.filter((slot) => !bookedSlots.includes(slot));
    } catch (error) {
      console.error(`Error getting available slots for date ${date}:`, error);
      throw error;
    }
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      const parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        throw new BadRequestException('Invalid date format');
      }

      return this.appointmentRepository.find({
        where: {
          appointmentDate: date,
        },
        order: {
          appointmentTime: 'ASC',
        },
      });
    } catch (error) {
      console.error(`Error getting appointments for date ${date}:`, error);
      throw error;
    }
  }

  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Appointment[]> {
    try {
      return this.appointmentRepository.find({
        where: {
          appointmentDate: Between(startDate, endDate),
        },
        order: {
          appointmentDate: 'ASC',
          appointmentTime: 'ASC',
        },
      });
    } catch (error) {
      console.error(
        `Error getting appointments in range ${startDate} to ${endDate}:`,
        error,
      );
      throw error;
    }
  }

  async getAppointmentsStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = addDays(today, 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Get counts for different statuses
      const [
        pendingCount,
        confirmedCount,
        completedCount,
        cancelledCount,
        totalCount,
      ] = await Promise.all([
        this.appointmentRepository.count({
          where: { status: AppointmentStatus.PENDING },
        }),
        this.appointmentRepository.count({
          where: { status: AppointmentStatus.CONFIRMED },
        }),
        this.appointmentRepository.count({
          where: { status: AppointmentStatus.COMPLETED },
        }),
        this.appointmentRepository.count({
          where: { status: AppointmentStatus.CANCELLED },
        }),
        this.appointmentRepository.count(),
      ]);

      // Get today's appointments
      const todayAppointments = await this.appointmentRepository.count({
        where: {
          appointmentDate: format(today, 'yyyy-MM-dd'),
        },
      });

      return {
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
        total: totalCount,
        today: todayAppointments,
      };
    } catch (error) {
      console.error('Error getting appointment stats:', error);
      throw error;
    }
  }

  private async checkTimeSlotAvailability(
    date: string,
    time: string,
  ): Promise<void> {
    try {
      // Check if time slot is already booked
      const existingAppointment = await this.appointmentRepository.findOne({
        where: {
          appointmentDate: date,
          appointmentTime: time,
          status: AppointmentStatus.PENDING || AppointmentStatus.CONFIRMED,
        },
      });

      if (existingAppointment) {
        throw new BadRequestException('This time slot is already booked');
      }
    } catch (error) {
      console.error(
        `Error checking time slot availability for ${date} at ${time}:`,
        error,
      );
      throw error;
    }
  }
  private generateAllTimeSlots(): string[] {
    const slots: string[] = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17) {
      const startHour = hour === 12 ? 12 : hour % 12;
      const startAmPm = hour < 12 ? 'AM' : 'PM';
      const startTime = `${startHour}:${minute === 0 ? '00' : '30'} ${startAmPm}`;

      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }

      const endHour = hour === 12 ? 12 : hour % 12;
      const endAmPm = hour < 12 ? 'AM' : 'PM';
      const endTime = `${endHour}:${minute === 0 ? '00' : '30'} ${endAmPm}`;

      slots.push(`${startTime} - ${endTime}`);
    }

    return slots;
  }
}
