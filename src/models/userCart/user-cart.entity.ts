import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class CartItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: string;
}

@Schema({ collection: 'userCart', versionKey: false })
export class UserCart extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  items: CartItem[];
}
export const UserCartSchema = SchemaFactory.createForClass(UserCart);
