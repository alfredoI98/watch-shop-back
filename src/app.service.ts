/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersModel } from './models/users/users.model';
import { ProductsModel } from './models/products/product.model';
import * as bcrypt from 'bcrypt';
import { AddNewProductDto } from './dto/add-new-product.dto';
import { AddProductCartDto } from './dto/add-product-cart.dto';
import { UserCartModel } from './models/userCart/user-cart.model';
import { UserFavoritesModel } from './models/userFavorites/user-favorites.model';
import { SaveUserFavoritesDto } from './dto/save-user-favorites.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly usersModel: UsersModel,
    private readonly productsModel: ProductsModel,
    private readonly userCartModel: UserCartModel,
    private readonly userFavoritesModel: UserFavoritesModel,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user.toObject ? user.toObject() : user;
    return safeUser;
  }

  private generateTokenPair(user: {
    _id: { toString(): string };
    email: string;
  }) {
    const userId = user._id.toString();
    const payload = { sub: userId, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(
        { ...payload, type: 'refresh' },
        { expiresIn: '7d' },
      ),
      expires_in: 900,
    };
  }

  async createUser(payload: CreateUserDto) {
    // Verificar si el usuario ya existe
    const userExists = await this.usersModel.findUserByEmail(payload.email);
    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    // Crear el nuevo usuario
    const user = await this.usersModel.createUser({
      ...payload,
      password: await bcrypt.hash(payload.password, 10),
    });

    const tokens = this.generateTokenPair(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async login(payload: ValidateLoginDto) {
    const user = await this.usersModel.findUserByEmail(payload.email);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    const safeUser = this.sanitizeUser(user);
    const tokens = this.generateTokenPair(user);

    return {
      ...tokens,
      user: safeUser,
    };
  }

  async refreshToken(payload: RefreshTokenDto) {
    const decoded = await this.jwtService.verifyAsync(payload.refreshToken);

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const user = await this.usersModel.findUserById(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const tokens = this.generateTokenPair(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async createProduct(payload: AddNewProductDto) {
    return this.productsModel.createProduct(payload);
  }

  async findProductById(id: string) {
    return this.productsModel.findProductById(id);
  }

  async findAllProducts() {
    return this.productsModel.findAllProducts();
  }

  async addToCart(payload: AddProductCartDto) {
    const user = await this.usersModel.findUserById(payload.userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const cartItem = await this.userCartModel.addProductToCart(payload);
    return cartItem;
  }

  async getCartByUserId(userId: string) {
    const user = await this.usersModel.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const cart = await this.userCartModel.findCartByUserId(userId);
    return cart;
  }

  async getFavoritesByUserId(userId: string) {
    const user = await this.usersModel.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const favorites = await this.userFavoritesModel.findByUserId(userId);
    const items = favorites?.items.length
      ? await this.productsModel.findProductsByIds(favorites.items)
      : [];

    if (!items) {
      throw new InternalServerErrorException(
        'No se pudieron consultar los productos favoritos',
      );
    }

    const productsById = new Map(
      items.map((product) => [product._id.toString(), product]),
    );
    return {
      items: (favorites?.items ?? [])
        .map((productId) => productsById.get(productId))
        .filter((product) => product !== undefined),
    };
  }

  async saveFavorites(payload: SaveUserFavoritesDto) {
    const user = await this.usersModel.findUserById(payload.userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const items = payload.items.length
      ? await this.productsModel.findProductsByIds(payload.items)
      : [];

    if (!items) {
      throw new InternalServerErrorException(
        'No se pudieron consultar los productos favoritos',
      );
    }
    if (items.length !== payload.items.length) {
      throw new BadRequestException('Uno o más productos favoritos no existen');
    }

    await this.userFavoritesModel.saveForUser(payload.userId, payload.items);
    const productsById = new Map(
      items.map((product) => [product._id.toString(), product]),
    );
    return {
      items: payload.items
        .map((productId) => productsById.get(productId))
        .filter((product) => product !== undefined),
    };
  }

  async getProductsByIds(ids: { ids: string[] }) {
    const products = await this.productsModel.findProductsByIds(ids.ids);
    return products;
  }
}
