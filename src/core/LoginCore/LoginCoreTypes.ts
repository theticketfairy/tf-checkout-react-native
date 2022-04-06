import { IError, IUserProfilePublic } from '../../types'

export interface ILoginCoreResponse {
  error?: IError
  data?: IUserProfilePublic
}
