import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './auth/public.decorator'; // 🔓 Decorador para indicar que la ruta es pública
import { AddNewProductDto } from './dto/add-new-product.dto';
import { AddProductCartDto } from './dto/add-product-cart.dto';
import { SaveUserFavoritesDto } from './dto/save-user-favorites.dto';

type AuthenticatedRequest = Request & {
  user: { sub: string };
};

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

  @Get('watches/favorites/:userId')
  getFavoritesByUserId(
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertCurrentUser(request, userId);
    return this.appService.getFavoritesByUserId(userId);
  }

  @Post('watches/favorites')
  saveFavorites(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    payload: SaveUserFavoritesDto,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertCurrentUser(request, payload.userId);
    return this.appService.saveFavorites(payload);
  }

  @Post('watches/ids')
  getProductsByIds(@Body() ids: { ids: string[] }) {
    return this.appService.getProductsByIds(ids);
  }

  private assertCurrentUser(request: AuthenticatedRequest, userId: string) {
    if (request.user.sub !== userId) {
      throw new ForbiddenException(
        'No puedes acceder a favoritos de otro usuario',
      );
    }
  }
}
