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

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly jwtService: JwtService,
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

    const isPasswordMatching = compare(password, user.password);
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
}
