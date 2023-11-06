import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { FindUserForSigninDto } from 'src/users/dto/find-user-for-signin.dto';
import { compare } from 'bcrypt';
import { FirebaseAdminService } from 'firebase.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  private async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'access-token-secret',
          //infinite access token is only for development
          expiresIn: 100000000,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'refresh-token-secret',
          expiresIn: 60 * 60 * 24 * 30,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async signUpLocal(createUserDto: CreateUserDto) {
    const isExists = await this.UsersService.findOneByEmail(
      createUserDto.email,
    );

    if (isExists) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const newUser = await this.UsersService.create(createUserDto);

    const tokens = await this.getTokens(newUser.id, newUser.email);

    return { ...newUser, ...tokens };
  }

  async signInLocal(findUserForSigninDto: FindUserForSigninDto) {
    const { email, password } = findUserForSigninDto;

    const user = await this.UsersService.findOneForSignIn(email);

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isPasswordMatching = await compare(password, user.password);
    console.log(isPasswordMatching);
    if (!isPasswordMatching) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const tokens = await this.getTokens(user.id, user.email);
    return { ...user, ...tokens };
  }

  async refreshToken(userId: any, email: string) {
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email,
      },
      {
        secret: 'access-token-secret',
        expiresIn: 60 * 60 * 24 * 30,
      },
    );

    return { accessToken };
  }

  async sendEmailLink() {
    const firebaseAuth = this.firebaseAdminService.getAdmin().auth();
    console.log('firebase auth', firebaseAuth);
    const emailLink = await firebaseAuth.generateEmailVerificationLink(
      'igor.kopylov.08d@inbox.ru',
      {
        url: 'https://jsonplaceholder.typicode.com/',
        handleCodeInApp: true,
      },
    );

    console.log('email emailLink', emailLink);
    return emailLink;
  }

  async googleAuth(email: string, name: string) {
    //google login
    const user = await this.UsersService.findOneByEmail(email);

    if (user) {
      const tokens1 = await this.getTokens(user.id, user.email);
      return { ...user, ...tokens1 };
    }

    //google sign up
    console.log('user not found, creating new user...');

    const savedUser = await this.UsersService.createByGoogle(email, name);

    const tokens2 = await this.getTokens(savedUser.id, savedUser.email);
    return { ...savedUser, ...tokens2 };
  }
}
