import React, { forwardRef, useImperativeHandle } from 'react'

import { removeTicketFromResale, resaleTicket } from '../../api/ApiClient'
import {
  IRemoveTicketFromResaleResponse,
  IResaleTicketResponse,
} from '../../api/types'
import { ICoreProps } from '../CoreProps'
import ResaleTicketsCoreHandle from './OrderDetailsCoreTypes'

const OrderDetailsCore = forwardRef<ResaleTicketsCoreHandle, ICoreProps>(
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
    }))

    return <>{props.children}</>
  }
)

export default OrderDetailsCore
