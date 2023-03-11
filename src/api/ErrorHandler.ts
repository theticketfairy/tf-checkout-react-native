import { AxiosError } from 'axios'

import { IError } from '../types'

const ERROR = 'Something went wrong!'

export const getApiError = (
  error: AxiosError,
  defaultMessage?: string
): IError => {
  const errorJSON = error.toJSON()

  if (error.response) {
    return {
      message: error.response?.data.message || defaultMessage,
      code: error.response?.status,
    }
  } else {
    if (error.code === 'ECONNABORTED') {
      return {
        message: errorJSON.message || 'Connection time out',
      }
    }
  }

  return {
    message: defaultMessage || ERROR,
  }
}
