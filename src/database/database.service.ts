import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Document, FilterQuery } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getModel<T extends Document>(name: string): Model<T> {
    return this.connection.model<T>(name);
  }

  async getAll<T extends Document>(
    modelName: string,
    criteria: FilterQuery<T>,
    skip = 0,
    limit = 10,
  ): Promise<T[]> {
    const model = this.getModel<T>(modelName);
    try {
      return await model.find(criteria).skip(skip).limit(limit).exec();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching data');
    }
  }

  async getById<T extends Document>(
    modelName: string,
    criteria: FilterQuery<T>,
  ): Promise<T | null> {
    const model = this.getModel<T>(modelName);
    try {
      const result = await model.findOne(criteria).exec();
      if (!result) {
        throw new NotFoundException('Document not found');
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching data');
    }
  }

  async create<T extends Document>(
    modelName: string,
    data: Partial<T>,
  ): Promise<T> {
    const model = this.getModel<T>(modelName);
    try {
      const newDoc = new model(data);
      return await newDoc.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating document');
    }
  }

  async update<T extends Document>(
    modelName: string,
    criteria: FilterQuery<T>,
    data: Partial<T>,
  ): Promise<T | null> {
    const model = this.getModel<T>(modelName);
    try {
      const updatedDoc = await model
        .findOneAndUpdate(criteria, data, { new: true })
        .exec();
      if (!updatedDoc) {
        throw new NotFoundException('Document not found');
      }
      return updatedDoc;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating document');
    }
  }

  async delete<T extends Document>(
    modelName: string,
    criteria: FilterQuery<T>,
  ): Promise<T | null> {
    const model = this.getModel<T>(modelName);
    try {
      const deletedDoc = await model.findOneAndDelete(criteria).exec();
      if (!deletedDoc) {
        throw new NotFoundException('Document not found');
      }
      return deletedDoc;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting document');
    }
  }
}
