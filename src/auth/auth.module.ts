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
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminService } from 'firebase.config';

@Module({
  imports: [UsersModule, JwtModule.register({}), ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    FirebaseAdminService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    AuthService,
  ],
})
export class AuthModule {}
