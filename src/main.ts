import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PromiseInterceptor } from './common/interceptors/promise.interceptor';
import { LoggerMiddleware } from './logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('Descripción de la API')
    .setVersion('1.0')
    .addTag('Mi API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description:
        'Por favor introduce el JWT con el formato Bearer en el campo',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');
  const options = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
  };
  SwaggerModule.setup('api', app, document, options);

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new PromiseInterceptor());
  app.use(new LoggerMiddleware().use);
  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
