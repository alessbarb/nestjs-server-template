import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggerConfig } from '../../logger/logger.config';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = LoggerConfig.getInstance();

  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'This endpoint allows for the creation of a new user in the system.',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    type: 'application/problem+json',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Authentication required.',
    type: 'application/problem+json',
  })
  @ApiBody({ type: CreateUserDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    try {
      const userId = req.user?.id || 'anonymous';
      this.logger.info('Creating a new user.');
      this.logger.log({
        level: 'audit',
        message: `User ${userId} attempting to create a new user.`,
      });
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Fetches a list of all registered users.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Authentication required.',
    type: 'application/problem+json',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req) {
    try {
      const userId = req.user?.id || 'anonymous';
      this.logger.info('Fetching all users.');
      this.logger.log({
        level: 'audit',
        message: `User ${userId} accessed all users list.`,
      });
      return await this.userService.getAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Fetches details of a specific user by their ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: 'application/problem+json',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Authentication required.',
    type: 'application/problem+json',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: '12345' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user?.id || 'anonymous';
      this.logger.info(`Fetching user with ID: ${id}.`);
      this.logger.log({
        level: 'audit',
        message: `User ${userId} accessed details of user with ID: ${id}.`,
      });
      return await this.userService.getById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
          type: 'application/problem+json',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Updates the details of a specific user by their ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: 'application/problem+json',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Authentication required.',
    type: 'application/problem+json',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: '12345' })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    try {
      const userId = req.user?.id || 'anonymous';
      this.logger.info(`Updating user with ID: ${id}.`);
      this.logger.log({
        level: 'audit',
        message: `User ${userId} attempting to update user with ID: ${id}.`,
      });
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found for update.',
          type: 'application/problem+json',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Deletes a specific user by their ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: 'application/problem+json',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Authentication required.',
    type: 'application/problem+json',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: '12345' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user?.id || 'anonymous';
      this.logger.info(`Removing user with ID: ${id}.`);
      this.logger.log({
        level: 'audit',
        message: `User ${userId} attempting to remove user with ID: ${id}.`,
      });
      return await this.userService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found for removal.',
          type: 'application/problem+json',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
