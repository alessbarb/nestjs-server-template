import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerConfig } from './logger.config';
import { MaskingUtil } from '../common/utils/masking.utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const logger = LoggerConfig.getInstance(); // Inicializamos el logger aquí
    const { ip, url, method, originalUrl, headers, body } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = uuidv4();

    req['requestId'] = requestId;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const logContext = {
        requestId,
        ip,
        method,
        url,
        originalUrl,
        statusCode,
        contentLength,
        userAgent,
        headers: MaskingUtil.maskSensitiveData(headers, 'headers'),
        body: MaskingUtil.maskSensitiveData(body, 'body'),
      };
      logger.info('Incoming request', logContext);
    });

    next();
  }
}
