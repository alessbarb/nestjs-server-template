import { Inject, Injectable } from '@nestjs/common';
import { JwtKeyModel } from './jwt-key.schema';
import UUIDv4 from '../common/utils/uuidv4.utils';
import { JWT_KEY_CRON_JOB } from './jwt-key.cron-job.tokens';
import { ICronJob } from '../cron/cron-job.interface';

@Injectable()
export class JwtKeyService {
  constructor(
    @Inject(JWT_KEY_CRON_JOB) private readonly cronJobService: ICronJob,
  ) {}

  static async createNewKey(): Promise<void> {
    const key = UUIDv4.generate();

    const now = new Date();
    const twoWeeksLater = new Date(now);
    twoWeeksLater.setDate(now.getDate() + 15);

    const jwtKey = new JwtKeyModel({
      key: key,
      createdAt: now,
      expiresAt: twoWeeksLater,
    });

    await jwtKey.save();
  }
}
