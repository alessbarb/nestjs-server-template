/**
 * Constant representing the job key for JWT-related cron jobs.
 *
 * This constant can be used as an identifier for scheduling,
 * tracking, or managing JWT-related jobs in a cron-based task scheduler.
 *
 * @example
 *
 * ```typescript
 * import { JWT_KEY_CRON_JOB } from 'path-to-constant';
 *
 * const jobKey = JWT_KEY_CRON_JOB;
 *
 * if (scheduledJob.key === jobKey) {
 *   // Do something related to the JWT cron job
 * }
 * ```
 *
 * @type {string}
 */
export const JWT_KEY_CRON_JOB: string = 'JWT_KEY_CRON_JOB';
