import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './auth/public.decorator'; // 🔓 Decorador para indicar que la ruta es pública

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Post('signup')
  createUser(@Body() payload: CreateUserDto) {
    return this.appService.createUser(payload);
  }

  @Public()
  @Post('login')
  login(@Body() payload: ValidateLoginDto) {
    return this.appService.login(payload);
  }

  @Get('perfil') // 🔒 Al NO tener el decorador, pedirá token automáticamente
  obtenerPerfil() {
    return { mensaje: 'Este es un endpoint protegido' };
  }
}
