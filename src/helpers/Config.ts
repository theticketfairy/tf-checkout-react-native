import _forEach from 'lodash/forEach'

import { Client } from '../api/ApiClient'
import Constants from '../api/Constants'
import { getDomainByClientAndEnv } from './Domains'
import { LocalStorageKeys, storeData } from './LocalStorage'

export type EnvType = 'PROD' | 'DEV' | 'STAG'

export interface IConfigAuth {
  ACCESS_TOKEN: string
  REFRESH_TOKEN: string
  TOKEN_TYPE: string
  SCOPE: string
}

export interface IConfig {
  EVENT_ID: string | number
  CLIENT?: string
  ENV?: EnvType
  CLIENT_ID?: string
  CLIENT_SECRET?: string
  TIMEOUT?: number
  BRAND?: string
  ARE_SUB_BRANDS_INCLUDED?: boolean
  AUTH?: IConfigAuth

  [key: string]: string | number | boolean | undefined | IConfigAuth
}

export const Config: IConfig = {} as IConfig

export const setConfig = async (
  configs: IConfig
): Promise<string | undefined> => {
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
  console.log('Config', Config)
  if (Config.AUTH) {
    console.log('Setting AUTH', Config.AUTH)
    await storeData(LocalStorageKeys.ACCESS_TOKEN, Config.AUTH.ACCESS_TOKEN)
    await storeData(
      LocalStorageKeys.AUTH_TOKEN_TYPE,
      Config.AUTH.TOKEN_TYPE || 'Bearer'
    )
    await storeData(LocalStorageKeys.AUTH_SCOPE, Config.AUTH.SCOPE)
    await storeData(LocalStorageKeys.REFRESH_TOKEN, Config.AUTH.REFRESH_TOKEN)
    Client.setAccessToken(Config.AUTH.ACCESS_TOKEN)
  }

  return undefined
}
