import axios from 'axios'

export function readableError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    return error.message
  } else {
    return String(error)
  }
}

/**
 * Logs the most useful information from any error (Axios or otherwise).
 */
export function logError(
  error: unknown,
  context?: string,
  options?: { logStack?: boolean; logConfig?: boolean }
) {
  const prefix = context ? `[${context}]` : '[Error]'

  if (axios.isAxiosError(error)) {
    console.error(`${prefix}: ${error.message}`)

    if (error.response) {
      console.error(`${prefix} Response:`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      })
    } else if (error.request) {
      console.error(`${prefix} No response received:`, error.request)
    }

    if (options?.logConfig) {
      console.error(`${prefix} Config:`, error.config)
    }
  } else if (error instanceof Error) {
    // Regular JS Error
    console.error(`${prefix}: ${error.message}`)
    if (options?.logStack) {
      console.error(`${prefix} Stack:`, error.stack)
    }
  } else {
    // Unknown type
    console.error(`${prefix} Unknown error:`, error)
  }
}
