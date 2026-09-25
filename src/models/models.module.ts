import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModel } from './users/users.model';
import { User, UserSchema } from './users/users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersModel],
  exports: [UsersModel],
})
export class ModelsModule {}
