import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { RolesModule } from '../roles/roles.module';
import { OTP } from '../entities/otp.entity'; 
import { OTPService } from '../services/otp.service'; 
import { EmailService } from '../services/email.service'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP]), 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    RolesModule,
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    OTPService,    
    EmailService    
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule, OTPService, EmailService], 
})
export class AuthModule {}
