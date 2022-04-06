import jwtDecode from 'jwt-decode'
import React, { forwardRef, useImperativeHandle } from 'react'

import { addToCart, fetchEvent, fetchTickets } from '../../api/ApiClient'
import {
  IAddToCartParams,
  IEventResponse,
  IFetchTicketsResponse,
} from '../../api/types'
import { Config } from '../../helpers/Config'
import {
  deleteAllData,
  deleteData,
  getData,
  LocalStorageKeys,
} from '../../helpers/LocalStorage'
import { IAddToCartResponse } from '../../types'
import { ICoreProps } from '../CoreProps'
import { IBookTicketsOptions, TicketsCoreHandle } from './TicketsCoreTypes'

const TicketsCore = forwardRef<TicketsCoreHandle, ICoreProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    async getTickets(promoCode?: string): Promise<IFetchTicketsResponse> {
      return await fetchTickets(promoCode)
    },

    async getEvent(): Promise<IEventResponse> {
      return await fetchEvent()
    },

    async addToCart({
      quantity,
      optionName,
      ticketId,
      price,
    }: IBookTicketsOptions): Promise<IAddToCartResponse> {
      const parsedEventId =
        typeof Config.EVENT_ID === 'string'
          ? parseInt(Config.EVENT_ID, 10)
          : Config.EVENT_ID

      const data: IAddToCartParams = {
        attributes: {
          alternative_view_id: null,
          product_cart_quantity: quantity,
          product_options: {
            [optionName]: ticketId,
          },
          product_id: parsedEventId,
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
      return await addToCart(data)
    },

    async getIsUserLoggedIn(): Promise<boolean> {
      const token = await getData(LocalStorageKeys.ACCESS_TOKEN)

      if (!token) {
        return false
      }

      const decodedToken = jwtDecode<{ exp: number }>(token)
      if (decodedToken && decodedToken.exp < Date.now() / 1000) {
        await deleteData(LocalStorageKeys.ACCESS_TOKEN)
        await deleteData(LocalStorageKeys.USER_DATA)
        return false
      }

      return true
    },

    async logout(): Promise<void> {
      await deleteAllData()
    },
  }))

  return <>{props.children}</>
})

export default TicketsCore
