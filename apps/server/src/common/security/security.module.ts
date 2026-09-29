import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { loadEnv } from '../../config/env';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/** JWT + guard dùng chung. Module nào có @UseGuards(JwtAuthGuard) chỉ cần import module này. */
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({ secret: loadEnv().JWT_SECRET, signOptions: { expiresIn: '7d' } }),
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class SecurityModule {}
