import {
  IResetPasswordRequestData,
  IResetPasswordResponse,
} from '../../api/types'

export type ResetPasswordCoreHandle = {
  postResetPassword(
    data: IResetPasswordRequestData
  ): Promise<IResetPasswordResponse>
}
