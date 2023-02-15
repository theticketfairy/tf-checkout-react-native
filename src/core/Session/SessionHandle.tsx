import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import { IFetchAccessTokenResponse } from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { ICoreProps } from '../CoreProps'
import { SessionHandleType } from './SessionCoreTypes'

const SessionHandle = forwardRef<SessionHandleType, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async refreshAccessToken(
        refreshToken?: string
      ): Promise<IFetchAccessTokenResponse> {
        return await refreshAccessTokenAsync(refreshToken)
      },

      async reloadData() {
        return null
      },
    }))

    return <>{props.children}</>
  }
)

export default SessionHandle
