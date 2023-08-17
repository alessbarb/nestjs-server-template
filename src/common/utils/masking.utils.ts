export class MaskingUtil {
  private static fieldsToMask = ['password', 'token', 'apiKey'];
  private static headersToMask = ['authorization', 'x-api-key'];

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

  public static setFieldsToMask(fields: string[]): void {
    this.fieldsToMask = fields;
  }

  public static setHeadersToMask(headers: string[]): void {
    this.headersToMask = headers;
  }
}
