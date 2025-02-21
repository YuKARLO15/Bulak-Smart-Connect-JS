import { Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from '../config/firebase';

@Injectable()
export class AuthService {
  async verifyToken(token: string) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return { uid: decodedToken.uid, email: decodedToken.email };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
