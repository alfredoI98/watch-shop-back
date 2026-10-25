import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'userFavorites', versionKey: false })
export class UserFavorites extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  items: string[];
}

export const UserFavoritesSchema = SchemaFactory.createForClass(UserFavorites);
