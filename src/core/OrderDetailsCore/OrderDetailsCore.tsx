import React, { forwardRef, useImperativeHandle } from 'react'

import { removeTicketFromResale, resaleTicket } from '../../api/ApiClient'
import {
  IFetchAccessTokenResponse,
  IRemoveTicketFromResaleResponse,
  IResaleTicketResponse,
} from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { ICoreProps } from '../CoreProps'
import { OrderDetailsCoreHandle } from './OrderDetailsCoreTypes'

const OrderDetailsCore = forwardRef<OrderDetailsCoreHandle, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async resaleTicket(
        data: FormData,
        orderHash: string
      ): Promise<IResaleTicketResponse> {
        return await resaleTicket(data, orderHash)
      },

      async removeTicketFromResale(
        orderHash: string
      ): Promise<IRemoveTicketFromResaleResponse> {
        return await removeTicketFromResale(orderHash)
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

export default OrderDetailsCore
