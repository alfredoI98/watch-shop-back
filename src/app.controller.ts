import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './auth/public.decorator'; // 🔓 Decorador para indicar que la ruta es pública
import { AddNewProductDto } from './dto/add-new-product.dto';

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

  @Post('watches')
  createProduct(@Body() payload: AddNewProductDto) {
    return this.appService.createProduct(payload);
  }
}
