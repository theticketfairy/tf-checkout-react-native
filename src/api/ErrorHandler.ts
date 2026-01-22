import { AxiosError } from 'axios';

import { IError } from '../types';

const ERROR = 'Something went wrong!';

interface ErrorResponseData {
  message?: string | { email?: string; [key: string]: any };
  [key: string]: any;
}

export const getApiError = (
  error: AxiosError<ErrorResponseData>,
  defaultMessage?: string
): IError => {
  const errorJSON = error.toJSON();

  if (error.response) {
    const message = error.response?.data?.message;
    return {
      message:
        typeof message === 'string' ? message : defaultMessage || ERROR,
      code: error.response?.status,
    };
  } else {
    if (error.code === 'ECONNABORTED') {
      return {
        // @ts-ignore
        message: errorJSON.message || 'Connection time out',
      };
    }
  }

  return {
    message: defaultMessage || ERROR,
  };
};
