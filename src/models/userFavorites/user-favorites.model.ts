import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserFavorites } from './user-favorites.entity';

@Injectable()
export class UserFavoritesModel {
  constructor(
    @InjectModel(UserFavorites.name)
    private readonly userFavoritesModel: Model<UserFavorites>,
  ) {}

  async findByUserId(userId: string) {
    return this.userFavoritesModel.findOne({ userId }).exec();
  }

  async saveForUser(userId: string, items: string[]) {
    return this.userFavoritesModel
      .findOneAndUpdate(
        { userId },
        { $set: { items } },
        { returnDocument: 'after', upsert: true, runValidators: true },
      )
      .exec();
  }
}
