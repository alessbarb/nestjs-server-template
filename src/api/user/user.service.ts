import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggerConfig } from '../../logger/logger.config';

/**
 * UserService
 *
 * This service is responsible for handling operations related to the User entity.
 * It interacts with the MongoDB database to create, read, update, and delete user records.
 * It also logs important operations for auditing purposes.
 */
@Injectable()
export class UserService {
  [x: string]: any;
  private readonly logger = LoggerConfig.getInstance();

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  /**
   * Creates a new user in the database.
   *
   * @param {CreateUserDto} createUserDto - Data Transfer Object containing user details.
   * @returns {Promise<User>} - A promise that resolves with the created user object.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      this.logger.info(`User with ID: ${savedUser.id} created.`);
      return savedUser;
    } catch (error) {
      if (error.code === 11000) {
        // Código de error específico de Mongoose para duplicados
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'The provided email is already registered.',
            type: 'application/problem+json',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.name === 'ValidationError') {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
            type: 'application/problem+json',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // Otros errores
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error creating the user.',
          type: 'application/problem+json',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Fetches all users from the database.
   *
   * @returns {Promise<User[]>} - A promise that resolves with an array of all user objects.
   */
  async getAll(): Promise<User[]> {
    try {
      this.logger.info('Fetching all users from database.');
      return this.userModel.find().exec();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching users.',
          type: 'application/problem+json',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetches a user by their ID from the database.
   *
   * @param {string} id - The ID of the user to fetch.
   * @returns {Promise<User | null>} - A promise that resolves with the user object if found, null otherwise.
   */
  async getById(id: string): Promise<User> {
    try {
      this.logger.info(`Fetching user with ID: ${id} from database.`);
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
            type: 'application/problem+json',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching user.',
          type: 'application/problem+json',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates details of a specific user by their ID.
   *
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - Data Transfer Object containing the new details of the user.
   * @returns {Promise<User>} - A promise that resolves with the updated user object.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found for update.',
          type: 'application/problem+json',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.info(`User with ID: ${id} updated.`);
    return updatedUser;
  }

  /**
   * Removes a specific user by their ID from the database.
   *
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<User>} - A promise that resolves with the removed user object.
   */
  async remove(id: string): Promise<User> {
    try {
      const removedUser = await this.userModel.findByIdAndRemove(id);
      if (!removedUser) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found for removal.',
            type: 'application/problem+json',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.info(`User with ID: ${id} removed.`);
      return removedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error removing the user.',
          type: 'application/problem+json',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetches a user by their email from the database.
   *
   * @param {string} email - The email of the user to fetch.
   * @returns {Promise<User | null>} - A promise that resolves with the user object if found, null otherwise.
   */
  async getByEmail(email: string): Promise<User | null> {
    try {
      this.logger.info(`Fetching user with email: ${email} from database.`);
      const user = await this.userModel.findOne({ email: email }).exec();
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching user by email.',
          type: 'application/problem+json',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
