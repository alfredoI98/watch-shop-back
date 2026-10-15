import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCart } from './user-cart.entity';
import { AddProductCartDto } from 'src/dto/add-product-cart.dto';

@Injectable()
export class UserCartModel {
  constructor(
    @InjectModel(UserCart.name) private readonly userCartModel: Model<UserCart>,
  ) {}

  async addProductToCart(payload: AddProductCartDto) {
    try {
      // Check if the user already has a cart
      const existingCart = await this.userCartModel.findOne({
        userId: payload.userId,
      });
      if (existingCart) {
        // Update existing cart
        const response = await this.userCartModel.findByIdAndUpdate(
          existingCart._id,
          { items: payload.items },
        );
        return response;
      }
      const response = await this.userCartModel.create(payload);
      return response;
    } catch (error) {
      console.log('Problema al agregar carrito de usuario:', error);
      return null;
    }
  }

  async findCartByUserId(userId: string) {
    try {
      const cart = await this.userCartModel.findOne({ userId });
      return cart;
    } catch (error) {
      console.log('Problema al buscar carrito de usuario:', error);
      return null;
    }
  }
}
