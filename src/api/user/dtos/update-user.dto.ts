import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The full name of the user.',
    example: 'John Doe',
    required: false,
  })
  readonly name?: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john.doe@example.com',
    required: false,
  })
  readonly email?: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'newpassword123',
    required: false,
  })
  readonly password?: string;
}
