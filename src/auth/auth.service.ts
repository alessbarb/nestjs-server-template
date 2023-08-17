import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../api/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, plainPass?: string): Promise<any> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (plainPass) {
      const isValidPassword = await bcrypt.compare(plainPass, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
