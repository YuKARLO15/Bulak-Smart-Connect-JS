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
        // Prevent data loss in development (below code is for development only)
        // synchronize: true,
        migrationsRun: false,
        dropSchema: false,

        // Only for development environments!
        beforeConnect: async (connection): Promise<void> => {
          if (process.env.NODE_ENV !== 'production') {
            await (
              connection as { query: (sql: string) => Promise<unknown> }
            ).query('SET FOREIGN_KEY_CHECKS=0;');
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
