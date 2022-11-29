import React, { forwardRef, useImperativeHandle } from 'react'

import { requestResetPassword } from '../../api/ApiClient'
import {
  IResetPasswordRequestData,
  IResetPasswordResponse,
} from '../../api/types'
import { ICoreProps } from '../CoreProps'
import { ResetPasswordCoreHandle } from './ResetPasswordCoreTypes'

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
