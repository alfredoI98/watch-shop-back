import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.entity';
import { AddNewProductDto } from 'src/dto/add-new-product.dto';

@Injectable()
export class ProductsModel {
  constructor(
    @InjectModel(Product.name) private readonly productsModel: Model<Product>,
  ) {}

  async createProduct(payload: AddNewProductDto) {
    try {
      const createdProduct = await this.productsModel.create(payload);
      return createdProduct;
    } catch (error) {
      console.log('Problema al crear producto:', error);
      throw new Error('Error al crear el producto');
    }
  }

  async findProductById(id: string) {
    try {
      const product = await this.productsModel.findById(id).exec();
      return product;
    } catch (error) {
      console.log('Problema al consultar el producto:', error);
      return null;
    }
  }

  async findAllProducts() {
    try {
      const products = await this.productsModel.find().exec();
      return products;
    } catch (error) {
      console.log('Problema al consultar los productos:', error);
      return null;
    }
  }
}
