import { Module, Global } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [NestConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongodbUri = configService.get<string>('MONGODB_URI');
        if (!mongodbUri) {
          throw new Error('MONGODB_URI is not defined in .env file');
        }
        return {
          uri: mongodbUri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestConfigModule, MongooseModule],
})
export class ConfigModule {}
