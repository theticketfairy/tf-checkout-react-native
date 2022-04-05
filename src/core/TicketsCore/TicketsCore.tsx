import React, { forwardRef, useImperativeHandle } from 'react'

import { addToCart, fetchEvent, fetchTickets } from '../../api/ApiClient'
import { IEventResponse, IFetchTicketsResponse } from '../../api/types'
import { Config } from '../../helpers/Config'
import { ITicketsResponsePayload } from '../../types'
import {
  IBookTicketsOptions,
  ITicketsCoreProps,
  TicketsCoreHandle,
} from './TicketsCoreTypes'

const TicketsCore = forwardRef<TicketsCoreHandle, ITicketsCoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async getTickets(promoCode?: string): Promise<IFetchTicketsResponse> {
        return await fetchTickets(Config.EVENT_ID, promoCode)
      },

      async getEvent(eventId: string): Promise<IEventResponse> {
        return await fetchEvent(eventId)
      },

      async addToCart({
        quantity,
        optionName,
        ticketId,
        price,
      }: IBookTicketsOptions): Promise<ITicketsResponsePayload> {
        const data = {
          attributes: {
            alternative_view_id: null,
            product_cart_quantity: quantity,
            product_options: {
              [optionName]: ticketId,
            },
            product_id: Config.EVENT_ID,
            ticket_types: {
              [ticketId]: {
                product_options: {
                  [optionName]: ticketId,
                  ticket_price: price,
                },
                quantity: quantity,
              },
            },
          },
        }
        return await addToCart(Config.EVENT_ID, data)
      },
    }))

    return <>{props.children}</>
  }
)

export default TicketsCore
