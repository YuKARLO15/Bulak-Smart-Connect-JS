import { Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from '../config/firebase';

@Injectable()
export class AuthService {
  async verifyToken(token: string) {
    try {
      console.log('Verifying token:', token); // Debugging statement
      const decodedToken = await auth.verifyIdToken(token);
      console.log('Decoded token:', decodedToken); // Debugging statement
      return decodedToken;
    } catch (error) {
      console.error('Token verification error:', error); // Debugging statement
      throw new UnauthorizedException('Invalid token');
    }
  }
}