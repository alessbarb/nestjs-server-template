import { AuthModule } from './auth/auth.module';
import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  OnModuleInit,
} from '@nestjs/common';

import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from './config/config.module';
import { MongooseDebugMiddleware } from './database/mongodb/mongoose.middleware';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerConfig } from './logger/logger.config';

import { UserModule } from './api/user/user.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    LoggerModule,
    DatabaseModule.forRoot('mongodb://localhost:27017', 'campbuddy'),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = LoggerConfig.getInstance();

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MongooseDebugMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  onModuleInit() {
    this.logger.info('AppModule initialized');
  }
}
