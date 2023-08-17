import { transports, format, createLogger, Logger } from 'winston';
import 'winston-daily-rotate-file';
import { MaskingUtil } from '../common/utils/masking.utils';
import * as crypto from 'crypto';

// Niveles personalizados de Winston
const winstonLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
  audit: 7,
};

const filterOnly = (level: string) =>
  format((info) => {
    if (info.level === level) {
      return info;
    }
    return false;
  })();

export class LoggerConfig {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static instance: Logger;

  private static humanReadableFormat = format.combine(
    format.colorize(),
    format.simple(),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level} [${info.uuid}]: ${info.message}`,
    ),
  );

  private static addUUID = format((info) => {
    info.uuid = uuidv4();
    return info;
  })();

  private constructor() {}

  public static createWinstonOptions() {
    return {
      levels: winstonLevels,
      format: format.combine(
        this.addUUID,
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ssZ' }),
        format.errors({ stack: true }),
        format.printf((info) => {
          const { metadata, ...mainInfo } = info;
          return (
            JSON.stringify(mainInfo) +
            (metadata ? JSON.stringify(metadata) : '')
          );
        }),
      ),
      defaultMeta: (info) => {
        return {
          uuid: info.uuid,
          level: info.level,
          message: info.message,
          timestamp: info.timestamp,
          metadata: {
            path: info.path,
            method: info.method,
            ip: info.ip,
            userAgent: info.userAgent,
            protocol: info.protocol,
            baseUrl: info.baseUrl,
            originalUrl: info.originalUrl,
            query: JSON.stringify(
              MaskingUtil.maskSensitiveData(info.query, 'query'),
            ),
            body: JSON.stringify(
              MaskingUtil.maskSensitiveData(info.body, 'body'),
            ),
            params: JSON.stringify(
              MaskingUtil.maskSensitiveData(info.params, 'params'),
            ),
            headers: JSON.stringify(
              MaskingUtil.maskSensitiveData(info.headers, 'headers'),
            ),
            statusCode: info.statusCode,
            context: info.context || {},
          },
        };
      },
      transports: [
        new transports.DailyRotateFile({
          level: 'error',
          filename: 'logs/%DATE%-error.log',
          datePattern: 'YYYYMMDD',
          zippedArchive: true,
          maxFiles: '14d',
          maxSize: 10 * 1024 * 1024,
        }),
        new transports.DailyRotateFile({
          level: 'audit',
          filename: 'logs/%DATE%-audit.log',
          datePattern: 'YYYYMMDD',
          zippedArchive: true,
          maxFiles: '14d',
          maxSize: 10 * 1024 * 1024,
          format: format.combine(
            filterOnly('audit'), // Usar el filtro aquí
            format.json(),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'info',
          filename: 'logs/%DATE%-system.log',
          datePattern: 'YYYYMMDD',
          zippedArchive: true,
          maxFiles: '30d',
          maxSize: 10 * 1024 * 1024,
        }),
        new transports.Console({
          format: this.isDevelopment ? this.humanReadableFormat : format.json(),
          level: this.isDevelopment ? 'debug' : 'info',
        }),
      ],
    };
  }

  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = createLogger(this.createWinstonOptions());
    }
    return this.instance;
  }
}

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r: number = crypto.randomBytes(1)[0] % 16 | 0;
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
