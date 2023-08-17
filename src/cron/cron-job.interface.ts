/**
 * Interface for defining scheduled tasks (cron jobs).
 *
 * The main purpose of this interface is to ensure that any class implementing it
 * provides a specific method (`handleCron`) to be executed when the cron job runs.
 *
 * @example
 * class SampleCronJob implements ICronJob {
 *   async handleCron(): Promise<void> {
 *     // Your cron job logic here
 *   }
 * }
 *
 * const job = new SampleCronJob();
 * job.handleCron(); // This will execute your cron job logic
 */
export interface ICronJob {
  /**
   * Method to be executed when the cron job runs.
   *
   * Implement this method in your class with the logic you want to be executed
   * whenever the cron job is triggered.
   *
   * @returns A promise which resolves once the cron job logic is complete.
   *
   * @example
   * class SampleCronJob implements ICronJob {
   *   async handleCron(): Promise<void> {
   *     console.log('Cron job executed!');
   *   }
   * }
   *
   * const job = new SampleCronJob();
   * job.handleCron(); // Logs: "Cron job executed!"
   */
  handleCron(): Promise<void>;
}
