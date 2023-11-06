// firebase.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';

@Injectable()
export class FirebaseAdminService {
  private admin: admin.app.App;

  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      credential: applicationDefault(),
      databaseURL: configService.get('FIREBASE_DATABASE_URL'),
    };

    if (!admin.apps.length) {
      this.admin = admin.initializeApp(firebaseConfig);
    } else {
      this.admin = admin.apps[0];
    }
  }

  getAdmin(): admin.app.App {
    return this.admin;
  }
}
