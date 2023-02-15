import {
  ICloseSessionResponse,
  IFetchAccessTokenData,
  IResetPasswordRequestData,
  IRestorePasswordResponse,
} from '../../api/types'
import { ILoginFields } from '../../components/login/types'
import { IError, IUserProfilePublic } from '../../types'

export interface ILoginCoreResponse {
  error?: IError
  userProfile?: IUserProfilePublic
  accessTokenData?: IFetchAccessTokenData
}

export type LoginCoreHandle = {
  login(fields?: ILoginFields): Promise<ILoginCoreResponse>
  logout(): Promise<ICloseSessionResponse>
  restorePassword(email: string): Promise<IRestorePasswordResponse>
  resetPassword(data: IResetPasswordRequestData): Promise<any>
}
