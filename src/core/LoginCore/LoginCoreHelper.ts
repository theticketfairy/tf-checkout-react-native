import { Config } from '../../helpers/Config'

export const getFetchAccessTokenBody = (
  authorizationCode: string
): FormData => {
  const bodyFormDataToken = new FormData()
  bodyFormDataToken.append('code', authorizationCode)
  bodyFormDataToken.append('scope', 'profile')
  bodyFormDataToken.append('grant_type', 'authorization_code')
  bodyFormDataToken.append('client_id', Config.CLIENT_ID)
  bodyFormDataToken.append('client_secret', Config.CLIENT_SECRET)

  return bodyFormDataToken
}

export const getRefreshAccessTokenBody = (refreshToken: string): FormData => {
  const bodyFormDataToken = new FormData()
  bodyFormDataToken.append('grant_type', 'refresh_token')
  bodyFormDataToken.append('client_id', Config.CLIENT_ID)
  bodyFormDataToken.append('client_secret', Config.CLIENT_SECRET)
  bodyFormDataToken.append('refresh_token', refreshToken)

  return bodyFormDataToken
}
