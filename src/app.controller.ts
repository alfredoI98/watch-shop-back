import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './auth/public.decorator'; // 🔓 Decorador para indicar que la ruta es pública
import { AddNewProductDto } from './dto/add-new-product.dto';
import { AddProductCartDto } from './dto/add-product-cart.dto';

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

  @Get('watches/:id')
  findProductById(@Param('id') id: string) {
    return this.appService.findProductById(id);
  }

  @Get('watches')
  findAllProducts() {
    return this.appService.findAllProducts();
  }

  @Post('watches/cart')
  addToCart(@Body() payload: AddProductCartDto) {
    return this.appService.addToCart(payload);
  }

  @Get('watches/cart/:userId')
  getCartByUserId(@Param('userId') userId: string) {
    return this.appService.getCartByUserId(userId);
  }

  @Post('watches/ids')
  getProductsByIds(@Body() ids) {
    return this.appService.getProductsByIds(ids);
  }
}
