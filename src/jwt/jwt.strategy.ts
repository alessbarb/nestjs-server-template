import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { JwtKeyModel } from './jwt-key.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const keys = await JwtKeyModel.find({
      createdAt: { $lte: new Date() },
      expiresAt: { $gte: new Date() },
    });

    for (const keyDoc of keys) {
      try {
        const decoded = this.jwtService.verify(payload.token, {
          secret: keyDoc.key,
        });
        if (decoded) {
          return user;
        }
      } catch (error) {
        // Ignora el error y prueba la siguiente clave
      }
    }

    throw new UnauthorizedException();
  }
}
