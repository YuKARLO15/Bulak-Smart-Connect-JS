import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { QueueModule } from './modules/queue/queue.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';

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
        synchronize: configService.get('NODE_ENV') !== 'production', //set this sheesh to true in development only
        logging: configService.get('NODE_ENV') !== 'production',
        logger: 'advanced-console',
        // Prevent data loss in development (below code is for development only)
        // synchronize: true,
        migrationsRun: false,
        dropSchema: false,

        // Only for development environments!
        beforeConnect: async (connection): Promise<void> => {
          if (process.env.NODE_ENV !== 'production') {
            const conn = connection as {
              query: (sql: string) => Promise<unknown>;
            };
            // Disable foreign key checks for development
            await conn.query('SET FOREIGN_KEY_CHECKS=0;');
            // Set time zone to UTC for consistent datetime handling
            await conn.query("SET time_zone = '+08:00';"); // Philippines time zone (UTC+8)
          }
        },
        afterConnect: async (connection): Promise<void> => {
          if (process.env.NODE_ENV !== 'production') {
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
