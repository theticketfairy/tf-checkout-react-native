import _forEach from 'lodash/forEach'

import { Client } from '../api/ApiClient'
import Constants from '../api/Constants'

export interface IConfig {
  DOMAIN?: string
  BASE_URL?: string
  CLIENT_ID?: string
  CLIENT_SECRET?: string
  TIMEOUT?: number
  BRAND?: string
  ARE_SUB_BRANDS_INCLUDED?: boolean
  // IS_BILLING_STREET_NAME_REQUIRED?: boolean

  [key: string]: string | number | boolean | undefined
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

  if (!Config.CLIENT_SECRET) {
    Config.CLIENT_SECRET = Constants.CLIENT_SECRET
  }
  if (!Config.Client_ID) {
    Config.CLIENT_ID = Constants.CLIENT_ID
  }

  if (!Config.ARE_SUB_BRANDS_INCLUDED) {
    Config.ARE_SUB_BRANDS_INCLUDED = false
  }
  if (Config.IS_BILLING_STREET_NAME_REQUIRED === undefined) {
    Config.IS_BILLING_STREET_NAME_REQUIRED = true
  }

  return undefined
}
