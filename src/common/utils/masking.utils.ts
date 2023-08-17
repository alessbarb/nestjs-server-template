/**
 * Utility class for masking sensitive data in various types of data structures.
 * Useful for logging and debugging without revealing sensitive information.
 *
 * @example
 * const data = { username: 'user', password: 'secret' };
 * const maskedData = MaskingUtil.maskSensitiveData(data);
 * console.log(maskedData); // Outputs: { username: 'user', password: '*****' }
 */
export class MaskingUtil {
  /**
   * Default fields in the data objects that should be masked.
   */
  private static fieldsToMask = ['password', 'token', 'apiKey'];

  /**
   * Default headers in the data objects that should be masked.
   */
  private static headersToMask = ['authorization', 'x-api-key'];

  /**
   * Masks sensitive data in the given data object.
   *
   * @param data - The data object that may contain sensitive information.
   * @param type - The type of the data object. Can be 'body', 'headers', 'params', or 'query'.
   * @returns The data object with the sensitive information masked.
   *
   * @example
   * const headers = { authorization: 'Bearer secretToken' };
   * const maskedHeaders = MaskingUtil.maskSensitiveData(headers, 'headers');
   * console.log(maskedHeaders); // Outputs: { authorization: '*****' }
   */
  public static maskSensitiveData(
    data: any,
    type: 'body' | 'headers' | 'params' | 'query' = 'body',
  ): any {
    const maskedData = { ...data };
    let fieldsToProcess = this.fieldsToMask;

    if (type === 'headers') {
      fieldsToProcess = this.headersToMask;
    }

    for (const field in maskedData) {
      if (fieldsToProcess.includes(field)) {
        maskedData[field] = '*****';
      } else if (
        typeof maskedData[field] === 'object' &&
        maskedData[field] !== null
      ) {
        maskedData[field] = this.maskSensitiveData(maskedData[field], type);
      }
    }

    return maskedData;
  }

  /**
   * Set new fields to be masked in the data objects.
   *
   * @param fields - An array of field names to be masked.
   *
   * @example
   * MaskingUtil.setFieldsToMask(['newSecretField']);
   */
  public static setFieldsToMask(fields: string[]): void {
    this.fieldsToMask = fields;
  }

  /**
   * Set new headers to be masked in the data objects.
   *
   * @param headers - An array of header names to be masked.
   *
   * @example
   * MaskingUtil.setHeadersToMask(['x-new-header']);
   */
  public static setHeadersToMask(headers: string[]): void {
    this.headersToMask = headers;
  }
}
