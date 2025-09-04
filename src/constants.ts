export const FEES_STYLES = {
  TRADITIONAL: 'TRADITIONAL',
  DISPLAY_BOTH: 'DISPLAY_BOTH',
}

export const DEFAULT_FEES_STYLE = FEES_STYLES.TRADITIONAL

export interface IConfigs {
  BASE_URL: string
  CLIENT_ID: string
  CLIENT_SECRET: string
  STRIPE_PUBLISHABLE_KEY: string
  X_SOURCE_ORIGIN: string
  FEES_STYLE: string
  [key: string]: string | number
}

export const CONFIGS: IConfigs = { FEES_STYLE: DEFAULT_FEES_STYLE } as IConfigs
