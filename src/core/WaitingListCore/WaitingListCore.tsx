import React, { forwardRef, useImperativeHandle } from 'react'

import { addToWaitingList } from '../../api/ApiClient'
import { IAddToWaitingListResponse } from '../../api/types'
import { IWaitingListFields } from '../../components/waitingList/types'
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
    }))

    return <>{props.children}</>
  }
)

export default WaitingListCore
