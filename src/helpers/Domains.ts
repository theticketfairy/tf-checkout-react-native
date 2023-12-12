import type { EnvType } from './Config'

export const getDomainByClientAndEnv = (
  client: string = 'ttf',
  env: EnvType = 'PROD'
): string => {
  //@ts-ignore
  const brand = domains[client] ?? 'ttf'
  let origin = ''

  if (typeof brand === 'string') {
    //@ts-ignore
    origin = domains[brand][env] ?? 'https://www.ticketfairy.com'
  } else {
    origin = brand[env]
  }

  return origin
}

const domains = {
  mana: {
    DEV: 'https://manacommon.com',
    STAG: 'https://manacommon.com',
    PROD: 'https://manacommon.com',
  },
  ttf: {
    DEV: 'https://sandbox.ticketfairy.com',
    STAG: 'https://test.ticketfairy.com',
    PROD: 'https://www.ticketfairy.com',
  },
}
