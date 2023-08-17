import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';

@Module({ providers: [DatabaseService], exports: [DatabaseService] })
export class DatabaseModule {
  static forRoot(uri: string, dbName: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forRoot(uri, { dbName })],
    };
  }

  static forFeature(models: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forFeature(models)],
    };
  }
}
