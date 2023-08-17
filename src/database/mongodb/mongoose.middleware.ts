import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerConfig } from '../../logger/logger.config';
import mongoose from 'mongoose';

@Injectable()
export class MongooseDebugMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const logger = LoggerConfig.getInstance();

    mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(
        `${collectionName}.${method} ${JSON.stringify(query)} ${JSON.stringify(
          doc,
        )}`,
      );
    });

    next();
  }
}
