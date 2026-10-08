import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModel } from './users/users.model';
import { User, UserSchema } from './users/users.entity';
import { Product, ProductSchema } from './products/products.entity';
import { ProductsModel } from './products/product.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [UsersModel, ProductsModel],
  exports: [UsersModel, ProductsModel],
})
export class ModelsModule {}
