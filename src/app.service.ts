/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersModel } from './models/users/users.model';
import { ProductsModel } from './models/products/product.model';
import * as bcrypt from 'bcrypt';
import { AddNewProductDto } from './dto/add-new-product.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly usersModel: UsersModel,
    private readonly productsModel: ProductsModel,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user.toObject ? user.toObject() : user;
    return safeUser;
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

    return {
      access_token: this.jwtService.sign({
        sub: user._id.toString(),
        email: user.email,
      }),
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
    return {
      access_token: this.jwtService.sign({
        sub: user._id.toString(),
        email: user.email,
      }),
      user: safeUser,
    };
  }

  async createProduct(payload: AddNewProductDto) {
    return this.productsModel.createProduct(payload);
  }
}
