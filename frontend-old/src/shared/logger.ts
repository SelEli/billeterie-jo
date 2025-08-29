type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private format(level: LogLevel, message: string, ...args: unknown[]) {
    const timestamp = new Date().toISOString();
    return [`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args];
  }

  debug(message: string, ...args: unknown[]) {
    if (import.meta.env.DEV) console.debug(...this.format('debug', message, ...args));
  }

  info(message: string, ...args: unknown[]) {
    console.info(...this.format('info', message, ...args));
  }

  warn(message: string, ...args: unknown[]) {
    console.warn(...this.format('warn', message, ...args));
  }

  error(message: string, ...args: unknown[]) {
    console.error(...this.format('error', message, ...args));
  }
}

export const logger = new Logger();
