//@ts-nocheck
import jwtDecode from 'jwt-decode'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _some from 'lodash/some'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { addToCart, fetchEvent, fetchTickets } from '../../api/ApiClient'
import { IPromoCodeResponse } from '../../api/types'
import {
  deleteData,
  getData,
  LocalStorageKeys,
} from '../../helpers/LocalStorage'
import { IEvent, ISelectedTicket, ITicket } from '../../types'
import TicketsView from './TicketsView'
import { ITicketsProps } from './types'

const Tickets = ({
  eventId,
  onAddToCartSuccess,
  onAddToCartError,
  onFetchTicketsError,
  styles,
  texts,
  isAccessCodeEnabled = false,
  isPromoEnabled = true,
  onPressMyOrders,
}: ITicketsProps) => {
  const [isUserLogged, setIsUserLogged] = useState(false)
  const [isGettingTickets, setIsGettingTickets] = useState(false)
  const [isGettingEvent, setIsGettingEvent] = useState(false)
  const [event, setEvent] = useState<IEvent>()
  const [isBooking, setIsBooking] = useState(false)
  const [tickets, setTickets] = useState<ITicket[]>([])
  const [isWaitingListVisible, setIsWaitingListVisible] = useState(false)
  const [isAccessCode, setIsAccessCode] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ISelectedTicket>()
  const [promoCodeResponse, setPromoCodeResponse] = useState<
    IPromoCodeResponse | undefined
  >(undefined)
  const [isFirstCall, setIsFirstCall] = useState(true)

  const showError = (error: string) => {
    Alert.alert('', error)
  }

  const isTicketOnSale = _some(
    tickets,
    (item) => item.salesStarted && !item.salesEnded && !item.soldOut
  )

  console.log('isTicketOnSale', isTicketOnSale)

  //#region Api calls

  const retrieveStoredAccessToken = async () => {
    const token = await getData(LocalStorageKeys.ACCESS_TOKEN)
    if (!token) {
      return setIsUserLogged(false)
    }

    const decodedToken = jwtDecode<{ exp: number }>(token)
    if (decodedToken && decodedToken.exp < Date.now() / 1000) {
      deleteData(LocalStorageKeys.ACCESS_TOKEN)
      deleteData(LocalStorageKeys.USER_DATA)
      return setIsUserLogged(false)
    }
    setIsUserLogged(true)
  }

  const getTickets = async (promoCode: string = '') => {
    setIsGettingTickets(true)
    const {
      error,
      tickets: responseTickets,
      promoCodeResult,
      isInWaitingList,
      isAccessCodeRequired,
    } = await fetchTickets(eventId, promoCode)
    setIsGettingTickets(false)
    if (error) {
      console.log(
        '%cTickets.tsx line:45 Tickets error',
        'color: #007acc;',
        error
      )

      if (onFetchTicketsError) {
        onFetchTicketsError(error)
      }

      showError('Error while getting tickets, please try again')
      return
    }

    setIsWaitingListVisible(!!isInWaitingList)
    setIsAccessCode(!!isAccessCodeRequired)

    if (responseTickets && !_isEmpty(responseTickets)) {
      setTickets(responseTickets)
      setPromoCodeResponse(promoCodeResult)

      if (!isFirstCall && !promoCodeResult?.isValid) {
        Alert.alert('', promoCodeResult?.message)
      }
    }

    setIsFirstCall(false)
  }

  const getEventData = async () => {
    setIsGettingEvent(true)
    const { eventError, eventData } = await fetchEvent(eventId)
    if (eventError) {
      return Alert.alert('', eventError)
    }
    setEvent(eventData)
    setIsGettingEvent(false)
  }

  const performBookTickets = async () => {
    const optionName = _get(selectedTicket, 'optionName')
    const ticketId = _get(selectedTicket, 'id')
    const ticketQuantity = selectedTicket?.selectedOption?.value
    const ticketPrice = selectedTicket?.price

    const data = {
      attributes: {
        alternative_view_id: null,
        product_cart_quantity: ticketQuantity,
        product_options: {
          [optionName]: ticketId,
        },
        product_id: eventId,
        ticket_types: {
          [ticketId]: {
            product_options: {
              [optionName]: ticketId,
              ticket_price: ticketPrice,
            },
            quantity: ticketQuantity,
          },
        },
      },
    }

    setIsBooking(true)
    const { data: result, error: addToCartError } = await addToCart(
      eventId,
      data
    )

    console.log('Add to Cart data', result)
    console.log('Add to Cart error', addToCartError)

    setIsBooking(false)

    if (result) {
      return onAddToCartSuccess(result)
    }

    if (addToCartError) {
      Alert.alert('', addToCartError)
      if (onAddToCartError) {
        onAddToCartError(addToCartError)
      }
      return
    }
  }
  //#endregion

  //#region UseEffects
  useEffect(() => {
    const fetchInitialData = async () => {
      await retrieveStoredAccessToken()
      await getTickets()
      await getEventData()
    }
    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  //#region Handlers
  const handleOnPressGetTickets = () => {
    performBookTickets()
  }

  const handleOnPressApplyPromoCode = async (code: string) => {
    await getTickets(code)
  }

  const handleOnSelectTicketOption = (ticket: ISelectedTicket) => {
    setSelectedTicket(ticket)
  }

  //#endregion

  console.log('PromoCode Response', promoCodeResponse)
  console.log('EVENT', event)
  return (
    <TicketsView
      eventId={eventId}
      isGettingTickets={isGettingTickets}
      tickets={tickets}
      onPressGetTickets={handleOnPressGetTickets}
      onPressApplyPromoCode={handleOnPressApplyPromoCode}
      promoCodeValidationMessage={promoCodeResponse?.message}
      isPromoCodeValid={promoCodeResponse?.isValid}
      onSelectTicketOption={handleOnSelectTicketOption}
      selectedTicket={selectedTicket}
      isBookingTickets={isBooking}
      styles={styles}
      texts={texts}
      event={event}
      isWaitingListVisible={isWaitingListVisible}
      isGetTicketsButtonVisible={isTicketOnSale || !event?.salesEnded}
      isAccessCodeEnabled={isAccessCodeEnabled || isAccessCode}
      isPromoEnabled={isPromoEnabled}
      isUserLogged={isUserLogged}
      onPressMyOrders={onPressMyOrders}
    />
  )
}

export default Tickets
