import { ILoginFields } from '../../components/login/types'
import { IError, IUserProfilePublic } from '../../types'

export interface ILoginCoreResponse {
  error?: IError
  data?: IUserProfilePublic
}

export type LoginCoreHandle = {
  login(fields?: ILoginFields): Promise<ILoginCoreResponse>
  logout(): Promise<void>
}
