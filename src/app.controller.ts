import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  createUser(@Body() payload: CreateUserDto) {
    return this.appService.createUser(payload);
  }

  @Post('login')
  login(@Body() payload: ValidateLoginDto) {
    return this.appService.login(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() request: { user: { sub: string; email: string } }) {
    return request.user;
  }
}
