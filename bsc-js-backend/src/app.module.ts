import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
// import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { QueueModule } from './modules/queue/queue.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { DocumentApplicationsModule } from './modules/document-applications/document-applications.module';
import { OTP } from './entities/otp.entity';
import { OTPService } from './services/otp.service';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true', // Use environment variable
        logging: configService.get('DB_LOGGING') === 'true', // Use environment variable
        logger: 'advanced-console',
        // Prevent data loss in development (below code is for development only)
        // synchronize: true,
        migrationsRun: false,
        dropSchema: false,

        // Only for development environments!
        beforeConnect: async (connection): Promise<void> => {
          if (configService.get('NODE_ENV') !== 'production') {
            const conn = connection as {
              query: (sql: string) => Promise<unknown>;
            };
            // Disable foreign key checks for development
            await conn.query('SET FOREIGN_KEY_CHECKS=0;');
            // Set time zone using environment variable
            await conn.query(`SET time_zone = '${configService.get('DB_TIMEZONE') || '+08:00'}';`);
          }
        },
        afterConnect: async (connection): Promise<void> => {
          if (configService.get('NODE_ENV') !== 'production') {
            await (
              connection as { query: (sql: string) => Promise<unknown> }
            ).query('SET FOREIGN_KEY_CHECKS=1;');
          }
        },
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    QueueModule,
    AppointmentModule,
    AnnouncementModule,
    DocumentApplicationsModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([OTP]),
  ],
  controllers: [AppController],
  providers: [AppService, OTPService, EmailService],
})
export class AppModule {}
