import _forEach from 'lodash/forEach'

import { Client } from '../api/ApiClient'

interface IConfig {
  BASE_URL: string
  CLIENT_ID: string
  CLIENT_SECRET: string
  STRIPE_PUBLISHABLE_KEY: string
  TIMEOUT: number

  [key: string]: string | number
}

export const CONFIGS: IConfig = {} as IConfig

export const setConfig = (configs: IConfig) => {
  _forEach(configs, (value, key) => {
    CONFIGS[key] = value
  })

  Client.setBaseUrl(CONFIGS.BASE_URL)
}
