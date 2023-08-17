import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PromiseInterceptor } from './common/interceptors/promise.interceptor';
import { LoggerMiddleware } from './logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new PromiseInterceptor());
  app.use(new LoggerMiddleware().use);
  await app.listen(3000);
}

bootstrap();
