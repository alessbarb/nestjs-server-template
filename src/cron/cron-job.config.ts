import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerConfig } from '../logger/logger.config';
import { ICronJob } from './cron-job.interface';

/**
 * `CronJobService` is a service class responsible for scheduling and managing cron jobs.
 * This service is designed to be reusable for different cron jobs by injecting the job's name and functionality.
 *
 * @example
 * const jobName = 'Sample Job';
 * const jobFunction = async () => { console.log('Job executed!'); };
 * const cronService = new CronJobService(jobName, jobFunction);
 *
 * @see ICronJob - for further details on the interface this service implements.
 */
@Injectable()
export class CronJobService implements ICronJob {
  // Logger instance to log messages related to cron job operations.
  private readonly logger = LoggerConfig.getInstance();

  // Name of the cron job, useful for logging and debugging.
  private readonly jobName: string;

  // Function that contains the logic to be executed when the cron job runs.
  private readonly jobFunction: () => Promise<void>;

  /**
   * Creates an instance of the `CronJobService`.
   *
   * @param {string} jobName - Name of the cron job.
   * @param {() => Promise<void>} jobFunction - Function containing the logic to be executed for the cron job.
   */
  constructor(jobName: string, jobFunction: () => Promise<void>) {
    this.jobName = jobName;
    this.jobFunction = jobFunction;
  }

  /**
   * Method that gets called when the cron job runs.
   * This method is scheduled to run every Monday at 00:00.
   * It logs the start of the job, executes the job logic, and handles any potential errors.
   */
  @Cron('0 0 * * 1')
  async handleCron() {
    this.logger.debug(`Called when cron runs for ${this.jobName}`);
    try {
      await this.jobFunction();
    } catch (error) {
      this.logger.error(
        `Error executing cron job for ${this.jobName}: ${error.message}`,
      );
    }
  }
}
