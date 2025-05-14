import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  email: string;
  roles?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secretKey = configService.get<string>('JWT_SECRET');

    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Validation for the payload
    if (!payload || payload.sub === undefined || isNaN(Number(payload.sub))) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const userId = Number(payload.sub);
    const email = String(payload.email || '');
    const roles = Array.isArray(payload.roles) ? payload.roles : [];
    
    return { sub: userId, email, roles };
  }
}
