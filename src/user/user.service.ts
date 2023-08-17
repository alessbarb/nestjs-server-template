import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggerConfig } from '../logger/logger.config';

@Injectable()
export class UserService {
  private readonly logger = LoggerConfig.getInstance();

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    this.logger.info(`User with ID: ${savedUser.id} created.`);
    return savedUser;
  }

  async getAll(): Promise<User[]> {
    this.logger.info('Fetching all users from database.');
    return this.userModel.find().exec();
  }

  async getById(id: string): Promise<User> {
    this.logger.info(`Fetching user with ID: ${id} from database.`);
    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    this.logger.info(`User with ID: ${id} updated.`);
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const removedUser = await this.userModel.findByIdAndRemove(id);
    this.logger.info(`User with ID: ${id} removed.`);
    return removedUser;
  }
}
