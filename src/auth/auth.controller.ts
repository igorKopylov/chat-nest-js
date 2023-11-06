import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { FindUserForSigninDto } from 'src/users/dto/find-user-for-signin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/local/signup')
  async signUpLocal(
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    console.log('endpoint /local/signup');
    const newUser = await this.authService.signUpLocal(createUserDto);
    return res.send(newUser);
  }

  @Post('/login')
  async signInLocal(
    @Res() res: Response,
    @Body() findUserForSigninDto: FindUserForSigninDto,
  ) {
    const newUser = await this.authService.signInLocal(findUserForSigninDto);
    return res.send(newUser);
  }

  @UseGuards(AuthGuard('google-strategy'))
  @Get('google')
  async googleLogin(@Res() res: Response) {
    return res.send({ msg: 'auth/google OK' });
  }

  @Post('/email/sendLink')
  async sendEmailLink(@Res() res: Response) {
    const emailLink = await this.authService.sendEmailLink();
    return res.send({ emailLink });
  }

  @UseGuards(AuthGuard('google-strategy'))
  @Get('google/redirect')
  async googleRedirect(@Res() res: Response, @Req() req: Request) {
    res.cookie('accessToken', req.user['accessToken'], {
      expires: new Date(new Date().getTime() + 15 * 6000),
    });
    console.log('req.user', req.user['accessToken']);
    res.redirect('http://localhost:3000/login-ways');
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    console.log('req.user', req.user);
    const newUser = await this.authService.refreshToken(
      req.user['user'],
      req.user['email'],
    );
    return res.send(newUser);
  }
}
