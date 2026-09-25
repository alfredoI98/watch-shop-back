import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidateLoginDto } from './dto/validate-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersModel } from './models/users/users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private readonly usersModel: UsersModel) {}

  async createUser(payload: CreateUserDto) {
    // Verificar si el usuario ya existe
    const userExists = await this.usersModel.findUserByEmail(payload.email);
    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    // Crear el nuevo usuario
    const user = this.usersModel.createUser({
      ...payload,
      password: await bcrypt.hash(payload.password, 10),
    });

    return user;
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

    return user;
  }
}
