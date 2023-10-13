import jwtDecode from 'jwt-decode'
import _find from 'lodash/find'
import _groupBy from 'lodash/groupBy'
import _map from 'lodash/map'
import _mapKeys from 'lodash/mapKeys'
import _sortBy from 'lodash/sortBy'
import React, { forwardRef, useImperativeHandle } from 'react'

import {
  addToCart,
  closeSession,
  fetchAccountTickets,
  fetchEvent,
  fetchTickets,
  postReferralVisit,
  unlockPasswordProtectedEvent,
} from '../../api/ApiClient'
import type {
  IAddToCartParams,
  ICloseSessionResponse,
  IEventResponse,
  IFetchAccessTokenResponse,
  IMyOrdersRequestParams,
  IPostReferralResponse,
} from '../../api/types'
import { Config } from '../../helpers/Config'
import {
  deleteData,
  getData,
  LocalStorageKeys,
} from '../../helpers/LocalStorage'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import type {
  IAccountTicketsResponse,
  IAddToCartResponse,
  ITicket,
} from '../../types'
import type { ICoreProps } from '../CoreProps'
import type {
  IBookTicketsOptions,
  IGetTicketsOptions,
  IGetTicketsPayload,
  IGroupedTickets,
  TicketsCoreHandle,
} from './TicketsCoreTypes'

const TicketsCore = forwardRef<TicketsCoreHandle, ICoreProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    async getTickets({
      promoCode,
      areTicketsSortedBySoldOut,
      areTicketsGrouped,
    }: IGetTicketsOptions): Promise<IGetTicketsPayload> {
      const groupTickets = (tickets: ITicket[]) => {
        // Create an array of tickets with the GroupName set
        const ticketsWithGroupName = _map(tickets, (ticket) => {
          return {
            ...ticket,
            groupName: ticket.groupName || '',
          }
        })
        const groupedTickets = _groupBy(ticketsWithGroupName, 'groupName')
        const ticketsSections: IGroupedTickets[] = []
        _mapKeys(groupedTickets, (val, key) => {
          ticketsSections.push({
            title: key,
            data: val,
          })
        })

        return ticketsSections
      }

      const ticketsResponse = await fetchTickets(promoCode)

      if (ticketsResponse.error || !ticketsResponse.tickets) {
        return ticketsResponse
      }

      const sortedTickets = areTicketsSortedBySoldOut
        ? _sortBy(_sortBy(ticketsResponse.tickets, 'sortOrder'), 'soldOut')
        : _sortBy(ticketsResponse.tickets, 'sortOrder')

      const areGroupsShown = !!_find(
        sortedTickets,
        (ticket) => ticket.groupName
      )

      if (!areTicketsSortedBySoldOut) {
        if (!areTicketsGrouped) {
          return {
            ...ticketsResponse,
            tickets: sortedTickets,
            areGroupsShown: false,
          }
        }
        if (areGroupsShown) {
          return {
            ...ticketsResponse,
            tickets: groupTickets(sortedTickets),
            areGroupsShown: areGroupsShown,
          }
        } else {
          return {
            ...ticketsResponse,
            tickets: sortedTickets,
            areGroupsShown: areGroupsShown,
          }
        }
      } else {
        // Sort tickets by sold out
        if (!areTicketsGrouped) {
          return {
            ...ticketsResponse,
            tickets: sortedTickets,
            areGroupsShown: false,
          }
        } else {
          if (areGroupsShown) {
            return {
              ...ticketsResponse,
              tickets: groupTickets(sortedTickets),
              areGroupsShown: areGroupsShown,
            }
          }
          return {
            ...ticketsResponse,
            tickets: sortedTickets,
            areGroupsShown: areGroupsShown,
          }
        }
      }
    },

    async getEvent(): Promise<IEventResponse> {
      return await fetchEvent()
    },

    async unlockPasswordProtectedEvent(
      password: string
    ): Promise<IEventResponse> {
      return await unlockPasswordProtectedEvent(password)
    },

    async addToCart({
      quantity,
      optionName,
      ticketId,
      price,
    }: IBookTicketsOptions): Promise<IAddToCartResponse> {
      if (!Config.EVENT_ID) {
        return {
          error: {
            message: 'Event ID is not configured',
          },
        }
      }
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

    async logout(): Promise<ICloseSessionResponse> {
      return await closeSession()
    },

    async postReferralVisit(
      referralId: string
    ): Promise<IPostReferralResponse> {
      return await postReferralVisit(referralId)
    },

    async refreshAccessToken(
      refreshToken?: string
    ): Promise<IFetchAccessTokenResponse> {
      return await refreshAccessTokenAsync(refreshToken)
    },

    async getAccountTickets(
      params: IMyOrdersRequestParams
    ): Promise<IAccountTicketsResponse> {
      return await fetchAccountTickets(params)
    },
  }))

  return <>{props.children}</>
})

export default TicketsCore
