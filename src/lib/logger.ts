/**
 * Structured logger for application-level logging.
 *
 * In Payload hooks, prefer `payload.logger` (Pino) which provides the same
 * structured JSON output. Use this logger in Next.js API routes, Server
 * Components, and other non-Payload code.
 *
 * All output goes to stdout as JSON → Vercel captures it → Vercel log drain
 * forwards to Axiom automatically.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  msg: string
  timestamp: string
  [key: string]: unknown
}

function log(level: LogLevel, msg: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    msg,
    timestamp: new Date().toISOString(),
    ...context,
  }

  const output = JSON.stringify(entry)

  switch (level) {
    case 'error':
      console.error(output)
      break
    case 'warn':
      console.warn(output)
      break
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(output)
      }
      break
    default:
      console.log(output)
  }
}

export const logger = {
  info: (msg: string, context?: Record<string, unknown>) => log('info', msg, context),
  warn: (msg: string, context?: Record<string, unknown>) => log('warn', msg, context),
  error: (msg: string, context?: Record<string, unknown>) => log('error', msg, context),
  debug: (msg: string, context?: Record<string, unknown>) => log('debug', msg, context),
}
