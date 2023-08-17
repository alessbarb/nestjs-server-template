import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  public validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super(
      ValidationException.formatErrors(validationErrors),
      HttpStatus.BAD_REQUEST,
    );
    this.validationErrors = validationErrors;
  }

  private static formatErrors(errors: ValidationError[]): string {
    const formattedErrors = errors.map((error) => {
      for (const constraint in error.constraints) {
        return `Field: ${error.property}, Error: ${error.constraints[constraint]}`;
      }
      return '';
    });
    return formattedErrors.join(', ');
  }
}
