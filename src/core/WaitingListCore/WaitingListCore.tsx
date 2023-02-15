import React, { forwardRef, useImperativeHandle } from 'react'

import { addToWaitingList } from '../../api/ApiClient'
import {
  IAddToWaitingListResponse,
  IFetchAccessTokenResponse,
} from '../../api/types'
import { IWaitingListFields } from '../../components/waitingList/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { ICoreProps } from '../CoreProps'
import {
  IAddToWaitingListCoreParams,
  WaitingListCoreHandle,
} from './WaitingListCoreTypes'

const WaitingListCore = forwardRef<WaitingListCoreHandle, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async addToWaitingList(
        params: IAddToWaitingListCoreParams
      ): Promise<IAddToWaitingListResponse> {
        const fields: IWaitingListFields = {
          ticketTypeId: '',
          quantity: '',
          ...params,
        }

        return await addToWaitingList(fields)
      },

      async refreshAccessToken(
        refreshToken?: string
      ): Promise<IFetchAccessTokenResponse> {
        return await refreshAccessTokenAsync(refreshToken)
      },
    }))

    return <>{props.children}</>
  }
)

export default WaitingListCore
