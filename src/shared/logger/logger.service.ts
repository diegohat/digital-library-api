import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp, context }) => {
  return `${timestamp} [${level}]${context ? ` [${context}]` : ''}: ${message}`;
});

const winstonLogger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat,
  ),
  transports: [new transports.Console()],
});

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string, context?: string) {
    winstonLogger.info(message, { context });
  }
  error(message: string, trace?: string, context?: string) {
    winstonLogger.error(`${message} ${trace ? '\n' + trace : ''}`, { context });
  }
  warn(message: string, context?: string) {
    winstonLogger.warn(message, { context });
  }
  debug(message: string, context?: string) {
    winstonLogger.debug(message, { context });
  }
  verbose(message: string, context?: string) {
    winstonLogger.verbose(message, { context });
  }
}
