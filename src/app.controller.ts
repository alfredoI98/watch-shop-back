import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';

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
}
