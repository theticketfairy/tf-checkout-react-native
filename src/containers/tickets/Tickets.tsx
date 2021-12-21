import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { addToCart, fetchTickets } from '../../api/ApiClient'
import { IPromoCodeResponse } from '../../api/types'
import { ISelectedTicket, ITicket } from '../../types'
import TicketsView from './TicketsView'
import { ITicketsProps } from './types'
import WaitingListView from './WaitingListView'

const Tickets = ({
  eventId,
  onAddToCartSuccess,
  onAddToCartError,
  onFetchTicketsError,
  styles,
  texts,
}: ITicketsProps) => {
  const [isGettingTickets, setIsGettingTickets] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [tickets, setTickets] = useState<ITicket[]>([])
  const [isWaitingListVisible, setIsWaitingListVisible] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ISelectedTicket>()
  const [promoCodeResponse, setPromoCodeResponse] = useState<
    IPromoCodeResponse | undefined
  >(undefined)
  const [isFirstCall, setIsFirstCall] = useState(true)

  const showError = (error: string) => {
    Alert.alert('', error)
  }

  //#region Api calls
  const getTickets = async (promoCode: string = '') => {
    setIsGettingTickets(true)
    const {
      error,
      tickets: responseTickets,
      promoCodeResult,
      isInWaitingList,
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

    if (responseTickets && !_isEmpty(responseTickets)) {
      setTickets(responseTickets)
      setPromoCodeResponse(promoCodeResult)

      if (!isFirstCall && !promoCodeResult?.isValid) {
        Alert.alert('', promoCodeResult?.message)
      }
    }

    setIsFirstCall(false)
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
      await getTickets()
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
  return isWaitingListVisible ? (
    <WaitingListView />
  ) : (
    <TicketsView
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
    />
  )
}

export default Tickets
