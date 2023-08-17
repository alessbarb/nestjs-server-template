import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggerConfig } from 'src/logger/logger.config';

@Controller('user')
export class UserController {
  private readonly logger = LoggerConfig.getInstance();

  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const userId = req.user?.id || 'anonymous'; // Assuming you have some user object in the request after authentication
    this.logger.info('Creating a new user.');
    this.logger.log({
      level: 'audit',
      message: `User ${userId} attempting to create a new user.`,
    });
    return this.userService.create(createUserDto);
  }

  @Get()
  getAll(@Request() req) {
    const userId = req.user?.id || 'anonymous';
    this.logger.info('Fetching all users.');
    this.logger.log({
      level: 'audit',
      message: `User ${userId} accessed all users list.`,
    });
    return this.userService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 'anonymous';
    this.logger.info(`Fetching user with ID: ${id}.`);
    this.logger.log({
      level: 'audit',
      message: `User ${userId} accessed details of user with ID: ${id}.`,
    });
    return this.userService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'anonymous';
    this.logger.info(`Updating user with ID: ${id}.`);
    this.logger.log({
      level: 'audit',
      message: `User ${userId} attempting to update user with ID: ${id}.`,
    });
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 'anonymous';
    this.logger.info(`Removing user with ID: ${id}.`);
    this.logger.log({
      level: 'audit',
      message: `User ${userId} attempting to remove user with ID: ${id}.`,
    });
    return this.userService.remove(id);
  }
}
