import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { VerifyCallback } from 'jsonwebtoken';

export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google-strategy',
) {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {
    super({
      clientID:
        '845758518375-uplm9l41skqsv4e86brrgkg723hdhmcn.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8080/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    console.log('accessToken', accessToken);
    const { emails, displayName } = profile;
    this.authService.googleAuth(emails[0].value, displayName);
    done(null, { ...profile, accessToken });
  }
}
