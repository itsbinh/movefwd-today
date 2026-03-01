interface LogContext {
  [key: string]: unknown
}

function stringify(value: unknown) {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const logger = {
  info(message: string, context: LogContext = {}) {
    console.info(`[INFO] ${message} ${stringify(context)}`)
  },
  warn(message: string, context: LogContext = {}) {
    console.warn(`[WARN] ${message} ${stringify(context)}`)
  },
  error(message: string, context: LogContext = {}) {
    console.error(`[ERROR] ${message} ${stringify(context)}`)
  },
}
