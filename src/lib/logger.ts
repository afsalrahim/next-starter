/**
 * Server-side logger utility
 * Use for debugging and monitoring in development and production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: unknown;
}

function formatLog(entry: LogEntry): string {
    const { level, message, timestamp, data } = entry;
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
}

export const logger = {
    info: (message: string, data?: unknown) => {
        const entry: LogEntry = {
            level: 'info',
            message,
            timestamp: new Date().toISOString(),
            data,
        };
        console.log(formatLog(entry));
    },

    warn: (message: string, data?: unknown) => {
        const entry: LogEntry = {
            level: 'warn',
            message,
            timestamp: new Date().toISOString(),
            data,
        };
        console.warn(formatLog(entry));
    },

    error: (message: string, error?: unknown) => {
        const entry: LogEntry = {
            level: 'error',
            message,
            timestamp: new Date().toISOString(),
            data: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        };
        console.error(formatLog(entry));
    },

    debug: (message: string, data?: unknown) => {
        if (process.env.NODE_ENV === 'development') {
            const entry: LogEntry = {
                level: 'debug',
                message,
                timestamp: new Date().toISOString(),
                data,
            };
            console.debug(formatLog(entry));
        }
    },
};
