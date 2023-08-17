import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user.',
    example: 'John Doe',
  })
  readonly name: string;

  @ApiProperty({
    description:
      'The email address of the user. It should be unique for each user.',
    example: 'john.doe@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user. It should be stored securely.',
    example: 'password123',
  })
  readonly password: string;
}
