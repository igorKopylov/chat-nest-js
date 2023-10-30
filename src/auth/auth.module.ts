import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import {
  AccessTokenStrategy,
  GoogleStrategy,
  RefreshTokenStrategy,
} from './strategies';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    AuthService,
  ],
})
export class AuthModule {}
