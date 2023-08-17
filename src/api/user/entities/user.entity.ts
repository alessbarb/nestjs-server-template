/**
 * User Entity.
 * This class represents the User model in the application.
 * It defines the structure of the User object with properties and their types.
 *
 * - `id`: Unique identifier for the user. It's optional as it might be provided by the database.
 * - `name`: Full name of the user.
 * - `email`: Email address of the user.
 * - `password`: Password for the user. It should be stored securely.
 */
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'The unique identifier for the user.',
    example: '12345',
    required: false,
  })
  id?: string;

  @ApiProperty({
    description: 'The full name of the user.',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description:
      'The email address of the user. It should be unique for each user.',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user. It should be stored securely.',
    example: 'password123',
  })
  password: string;
}
