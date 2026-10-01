import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.entity';
// import { ValidateLoginDto } from 'src/dto/validate-login.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class UsersModel {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  async createUser(payload: CreateUserDto) {
    try {
      const createdUser = await this.usersModel.create(payload);
      return createdUser;
    } catch (error) {
      console.log('Problema al crear usuario:', error);
      throw new Error('Error al crear el usuario');
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.usersModel.findOne({ email }).exec();
      return user;
    } catch (error) {
      console.log('Problema al consultar los usuarios:', error);
      return null;
    }
  }
}
