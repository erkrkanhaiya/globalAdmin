/**
 * Request Logger Middleware
 * Logs HTTP request information
 */

interface RequestLogData {
  method: string
  url: string
  ip: string
  statusCode: number
  responseTime: string
}

export const requestLogger = (data: RequestLogData): void => {
  const { method, url, ip, statusCode, responseTime } = data
  
  // Color codes for terminal output
  const statusColor = statusCode >= 500 ? '\x1b[31m' : // Red for 5xx
                      statusCode >= 400 ? '\x1b[33m' : // Yellow for 4xx
                      statusCode >= 300 ? '\x1b[36m' : // Cyan for 3xx
                      '\x1b[32m' // Green for 2xx
  const resetColor = '\x1b[0m'
  
  // Format: [METHOD] URL - STATUS - TIME - IP
  const logMessage = `${statusColor}[${method}]${resetColor} ${url} - ${statusColor}${statusCode}${resetColor} - ${responseTime} - ${ip}`
  
  console.log(logMessage)
}
