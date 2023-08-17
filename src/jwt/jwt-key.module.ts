import { JWT_KEY_CRON_JOB } from './jwt-key.cron-job.tokens';
import { CronJobService } from '../cron/cron-job.config';
import { Module } from '@nestjs/common';
import { JwtKeyService } from './jwt-key.service';

@Module({
  providers: [
    JwtKeyService,
    {
      provide: JWT_KEY_CRON_JOB,
      useFactory: () => {
        return new CronJobService(
          'JWT Key Generation',
          JwtKeyService.createNewKey,
        );
      },
    },
  ],
})
export class JwtKeyModule {}
