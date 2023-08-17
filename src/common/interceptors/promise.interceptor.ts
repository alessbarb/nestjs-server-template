import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerConfig } from 'src/logger/logger.config';
import { MaskingUtil } from '../utils/masking.utils';

@Injectable()
export class PromiseInterceptor implements NestInterceptor {
  private readonly logger = LoggerConfig.getInstance();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const request = context.switchToHttp().getRequest();
        const errorContext = {
          method: request.method,
          url: request.url,
          headers: MaskingUtil.maskSensitiveData(request.headers, 'headers'),
          body: MaskingUtil.maskSensitiveData(request.body, 'body'),
          params: MaskingUtil.maskSensitiveData(request.params, 'params'),
          query: MaskingUtil.maskSensitiveData(request.query, 'query'),
          errorMessage: err.message,
          stack: err.stack || null,
        };

        this.logger.error('Promise error', errorContext);

        return throwError(err);
      }),
    );
  }
}
