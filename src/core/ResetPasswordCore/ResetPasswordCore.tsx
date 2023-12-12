import React, { forwardRef, useImperativeHandle } from 'react'

import { requestResetPassword } from '../../api/ApiClient'
import type {
  IResetPasswordRequestData,
  IResetPasswordResponse,
} from '../../api/types'
import type { ICoreProps } from '../CoreProps'
import type { ResetPasswordCoreHandle } from './ResetPasswordCoreTypes'

const ResetPasswordCore = forwardRef<ResetPasswordCoreHandle, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async postResetPassword(
        data: IResetPasswordRequestData
      ): Promise<IResetPasswordResponse> {
        return await requestResetPassword(data)
      },
    }))
    return <>{props.children}</>
  }
)

export default ResetPasswordCore
