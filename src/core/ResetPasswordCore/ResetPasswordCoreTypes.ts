import { IResetPasswordRequestData } from '../../api/types'

export type ResetPasswordCoreHandle = {
  postResetPassword(data: IResetPasswordRequestData): Promise<any>
}
