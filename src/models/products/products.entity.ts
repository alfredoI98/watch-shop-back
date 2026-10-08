import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'products', versionKey: false })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  movementType: string;

  @Prop({ required: true })
  waterResistance: string;

  @Prop({ required: true })
  imagePath: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
