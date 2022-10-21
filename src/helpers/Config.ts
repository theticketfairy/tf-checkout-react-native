import _forEach from 'lodash/forEach'

import { Client } from '../api/ApiClient'
import Constants from '../api/Constants'
import { getDomainByClientAndEnv } from './Domains'

export type EnvType = 'PROD' | 'DEV' | 'STAG'

export interface IConfig {
  EVENT_ID: string | number
  CLIENT?: string
  ENV?: EnvType
  CLIENT_ID?: string
  CLIENT_SECRET?: string
  TIMEOUT?: number
  BRAND?: string
  ARE_SUB_BRANDS_INCLUDED?: boolean

  [key: string]: string | number | boolean | undefined
}

export const Config: IConfig = {} as IConfig

export const setConfig = (configs: IConfig): string | undefined => {
  _forEach(configs, (value, key) => {
    Config[key] = value
  })

  if (Config.ENV) {
    if (Config.ENV === 'PROD') {
      Client.setBaseUrl(Constants.BASE_URL)
    } else if (Config.ENV === 'DEV') {
      Client.setBaseUrl(Constants.BASE_URL_DEV)
    } else if (Config.ENV === 'STAG') {
      Client.setBaseUrl(Constants.BASE_URL_STAG)
    }
  } else {
    Client.setBaseUrl(Constants.BASE_URL)
  }

  if (Config.TIMEOUT) {
    Client.setTimeOut(Config.TIMEOUT)
  }

  if (Config.CLIENT) {
    Client.setDomain(getDomainByClientAndEnv(Config.CLIENT, Config.ENV))
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

  Config.IS_BILLING_STREET_NAME_REQUIRED = true

  return undefined
}
