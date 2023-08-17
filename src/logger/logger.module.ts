import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format } from 'winston';

import { LoggerConfig } from './logger.config';

@Module({
  imports: [
    WinstonModule.forRoot({
      ...LoggerConfig.createWinstonOptions(),
      format: format.combine(LoggerConfig.createWinstonOptions().format),
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
