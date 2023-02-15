import { IFetchAccessTokenResponse } from '../../api/types'

export type SessionHandleType = {
  refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
  reloadData(): void
}

export type SessionCoreHandleType = {
  refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
}
