import _forEach from 'lodash/forEach'

import { Client } from '../api/ApiClient'

export interface IConfig {
  DOMAIN?: string
  BASE_URL?: string
  CLIENT_ID?: string
  TIMEOUT?: number

  [key: string]: string | number | undefined
}

export const Config: IConfig = {} as IConfig

export const setConfig = (configs: IConfig): string | undefined => {
  _forEach(configs, (value, key) => {
    Config[key] = value
  })

  if (Config.BASE_URL) {
    Client.setBaseUrl(Config.BASE_URL)
  }

  if (Config.TIMEOUT) {
    Client.setTimeOut(Config.TIMEOUT)
  }

  if (Config.DOMAIN) {
    Client.setDomain(Config.DOMAIN)
  }

  if (Config.CLIENT_ID) {
    Client.setDomain(Config.CLIENT_ID)
  }

  return undefined
}
