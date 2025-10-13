export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level?: LogLevel;
  showTimestamp?: boolean;
}

export class Logger {
  private readonly level: LogLevel;
  private readonly showTimestamp: boolean;
  public readonly debug: (...data: any[]) => void;
  public readonly info: (...data: any[]) => void;
  public readonly warn: (...data: any[]) => void;
  public readonly error: (...data: any[]) => void;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || 'info';
    this.showTimestamp = options.showTimestamp ?? true;
    this.debug = this.shouldLog('debug')
      ? console.debug.bind('', ...this.loggerArgs('debug'))
      : () => null;
    this.warn = this.shouldLog('warn')
      ? console.warn.bind('', ...this.loggerArgs('warn'))
      : () => null;
    this.info = this.shouldLog('info')
      ? console.info.bind('', ...this.loggerArgs('info'))
      : () => null;
    this.error = this.shouldLog('error')
      ? console.error.bind('', ...this.loggerArgs('error'))
      : () => null;
  }

  private getTimestamp(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  private formatMessage(level: LogLevel, ...args: any[]): [string, ...any[]] {
    const timestamp = this.showTimestamp ? `[${this.getTimestamp()}]` : '';

    return [`${timestamp}`, ...args];
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

    if (levels.indexOf(this.level) < 0) {
      return false;
    }

    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private loggerArgs(level: LogLevel, ...args: any[]) {
    const [message, ...rest] = this.formatMessage(level, ...args);

    return [`%c${message}`, ...rest];
  }
}
