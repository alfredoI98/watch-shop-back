import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModel } from './users/users.model';
import { User, UserSchema } from './users/users.entity';
import { Product, ProductSchema } from './products/products.entity';
import { ProductsModel } from './products/product.model';
import { UserCart, UserCartSchema } from './userCart/user-cart.entity';
import { UserCartModel } from './userCart/user-cart.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: UserCart.name, schema: UserCartSchema },
    ]),
  ],
  providers: [UsersModel, ProductsModel, UserCartModel],
  exports: [UsersModel, ProductsModel, UserCartModel],
})
export class ModelsModule {}
