import { fetchAccessToken } from '../api/ApiClient'
import type { IFetchAccessTokenResponse } from '../api/types'
import { getRefreshAccessTokenBody } from '../core/LoginCore/LoginCoreHelper'
import { getData, LocalStorageKeys } from './LocalStorage'

export const refreshAccessToken = async (
  refreshToken?: string
): Promise<IFetchAccessTokenResponse> => {
  let token = await getData(LocalStorageKeys.REFRESH_TOKEN)
  if (refreshToken) {
    token = refreshToken
  }
  if (!token) {
    return {
      accessTokenError: {
        message: 'There is not stored or passed Refresh Token',
      },
    }
  }

  const refreshTokenBody = getRefreshAccessTokenBody(token)
  const response = await fetchAccessToken(refreshTokenBody)

  return response
}
