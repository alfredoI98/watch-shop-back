import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModel } from './users/users.model';
import { User, UserSchema } from './users/users.entity';
import { Product, ProductSchema } from './products/products.entity';
import { ProductsModel } from './products/product.model';
import { UserCart, UserCartSchema } from './userCart/user-cart.entity';
import { UserCartModel } from './userCart/user-cart.model';
import {
  UserFavorites,
  UserFavoritesSchema,
} from './userFavorites/user-favorites.entity';
import { UserFavoritesModel } from './userFavorites/user-favorites.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: UserCart.name, schema: UserCartSchema },
      { name: UserFavorites.name, schema: UserFavoritesSchema },
    ]),
  ],
  providers: [UsersModel, ProductsModel, UserCartModel, UserFavoritesModel],
  exports: [UsersModel, ProductsModel, UserCartModel, UserFavoritesModel],
})
export class ModelsModule {}
