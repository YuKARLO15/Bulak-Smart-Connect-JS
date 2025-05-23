import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  appointmentNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleInitial: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column()
  reasonOfVisit: string;

  @Column({ type: 'date' })
  appointmentDate: string;

  @Column()
  appointmentTime: string;

  @Column({ 
    type: 'enum', 
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ 
    name: 'userId',
    foreignKeyConstraintName: 'FK_appointment_user' 
  })
  user: User;

  @Column({ default: false })
  isGuest: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
