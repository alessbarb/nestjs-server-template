import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerConfig } from 'src/logger/logger.config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = LoggerConfig.getInstance();

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage = {
      method: request.method,
      url: request.url,
      status,
      message: JSON.stringify(message),
      ip: request.ip,
      stack: exception['stack'] || null,
    };

    this.logger.error('Exception caught', errorMessage);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof HttpException
          ? message
          : 'An unexpected error occurred',
    });
  }
}
