import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { LoginInput, RegisterInput } from '@keepay/shared';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const email = input.email.toLowerCase();
    if (await this.users.findByEmail(email)) throw new ConflictException('Email đã được sử dụng');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({ email, passwordHash, displayName: input.displayName });
    return this.issue(user.id, user.displayName);
  }

  async login(input: LoginInput) {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    const ok = user && (await bcrypt.compare(input.password, user.passwordHash));
    if (!user || !ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    return this.issue(user.id, user.displayName);
  }

  private async issue(userId: string, displayName: string) {
    const accessToken = await this.jwt.signAsync({ sub: userId });
    return { accessToken, user: { id: userId, displayName } };
  }
}
