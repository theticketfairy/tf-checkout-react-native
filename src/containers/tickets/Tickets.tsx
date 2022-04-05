import jwtDecode from 'jwt-decode'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _some from 'lodash/some'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import { addToCart, fetchEvent, fetchTickets } from '../../api/ApiClient'
import { IAddToCartParams, IPromoCodeResponse } from '../../api/types'
import {
  deleteAllData,
  deleteData,
  getData,
  LocalStorageKeys,
} from '../../helpers/LocalStorage'
import {
  IEvent,
  IOnFetchTicketsSuccess,
  ISelectedTicket,
  ITicket,
} from '../../types'
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
  onPressLogout,
  onFetchTicketsSuccess,
  onFetchEventError,
  onLoadingChange,
  areAlertsEnabled = true,
  areLoadingIndicatorsEnabled = true,
  onFetchEventSuccess,
  onAddToWaitingListError,
  onAddToWaitingListSuccess,
  promoCodeCloseIcon,
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

  const eventErrorCodeRef = useRef(0)

  const showAlert = (message: string) => {
    if (areAlertsEnabled) {
      Alert.alert('', message)
    }
  }

  const isTicketOnSale = _some(
    tickets,
    (item) => item.salesStarted && !item.salesEnded && !item.soldOut
  )

  //#region Api calls
  const retrieveStoredAccessToken = async () => {
    const token = await getData(LocalStorageKeys.ACCESS_TOKEN)
    if (!token) {
      return setIsUserLogged(false)
    }

    const decodedToken = jwtDecode<{ exp: number }>(token)
    if (decodedToken && decodedToken.exp < Date.now() / 1000) {
      await deleteData(LocalStorageKeys.ACCESS_TOKEN)
      await deleteData(LocalStorageKeys.USER_DATA)
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
      onFetchTicketsError?.(error)
      return showAlert('Error while getting tickets, please try again')
    }

    setIsWaitingListVisible(!!isInWaitingList)
    setIsAccessCode(!!isAccessCodeRequired)

    if (responseTickets && !_isEmpty(responseTickets)) {
      setTickets(responseTickets)

      if (isFirstCall && promoCodeResult?.isValid) {
        setPromoCodeResponse(promoCodeResult)
      } else if (!isFirstCall) {
        setPromoCodeResponse(promoCodeResult)
      }

      const onFetchTicketsData: IOnFetchTicketsSuccess = {
        promoCodeResponse: {
          success: true,
          message: promoCodeResponse?.message,
        },
        tickets: responseTickets,
        isInWaitingList,
        isAccessCodeRequired,
      }

      onFetchTicketsSuccess?.(onFetchTicketsData)

      if (
        !isFirstCall &&
        (!promoCodeResult?.isValid || promoCodeResult.isValid === 0)
      ) {
        onFetchTicketsSuccess?.({
          ...onFetchTicketsData,
          promoCodeResponse: {
            success: false,
            message: promoCodeResult?.message,
          },
        })
      }
    }

    setIsFirstCall(false)
  }

  const getEventData = async () => {
    setIsGettingEvent(true)
    const { eventError, eventData } = await fetchEvent(eventId)
    setIsGettingEvent(false)

    if (eventError) {
      eventErrorCodeRef.current = eventError.code || 400
      showAlert(eventError.message)
      return onFetchEventError?.(
        eventError || { message: 'There was an error while fetching event' }
      )
    }

    if (!eventData) {
      return onFetchEventError?.({
        message: 'There was an error while fetching event',
      })
    }

    onFetchEventSuccess?.(eventData)
    setEvent(eventData)
  }

  const performBookTickets = async () => {
    if (!selectedTicket || !selectedTicket.selectedOption) {
      onAddToCartError?.({ message: 'Please select a ticket' })
      return showAlert('Please select a ticket')
    }

    const optionName = _get(selectedTicket, 'optionName')
    const ticketId = _get(selectedTicket, 'id')
    const ticketQuantity =
      typeof selectedTicket.selectedOption.value === 'string'
        ? parseInt(selectedTicket.selectedOption.value, 10)
        : selectedTicket.selectedOption.value
    const ticketPrice = selectedTicket.price

    const data: IAddToCartParams = {
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
    setIsBooking(false)

    if (result) {
      return onAddToCartSuccess?.(result)
    }

    if (addToCartError) {
      showAlert(addToCartError.message || 'Error while adding tickets to cart')
      return onAddToCartError?.(addToCartError)
    }
  }
  //#endregion

  const onLoadingChangeCallback = useCallback(
    (loading: boolean) => {
      if (onLoadingChange) {
        onLoadingChange(loading)
      }
    },
    [onLoadingChange]
  )

  //#region UseEffects
  useEffect(() => {
    if (isGettingEvent || isGettingTickets || isBooking) {
      onLoadingChangeCallback(true)
    } else {
      onLoadingChangeCallback(false)
    }
  }, [isGettingTickets, isGettingEvent, isBooking, onLoadingChangeCallback])

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
    if (eventErrorCodeRef.current !== 0) {
      showAlert('Event not found')
      return onAddToCartError?.({
        code: eventErrorCodeRef.current,
        message: 'Event not found',
      })
    }
    performBookTickets()
  }

  const handleOnPressApplyPromoCode = async (code: string) => {
    await getTickets(code)
  }

  const handleOnSelectTicketOption = (ticket: ISelectedTicket) => {
    setSelectedTicket(ticket)
  }

  const handleOnLogout = async () => {
    await deleteAllData()
    setIsUserLogged(false)

    await getTickets()
    await getEventData()
    if (onPressLogout) {
      onPressLogout()
    }
  }

  const handleOnLoadingChange = (loading: boolean) => {
    onLoadingChangeCallback(loading)
  }
  //#endregion

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
      isGettingEvent={isGettingEvent}
      texts={texts}
      event={event}
      isWaitingListVisible={isWaitingListVisible}
      isGetTicketsButtonVisible={isTicketOnSale || !event?.salesEnded}
      isAccessCodeEnabled={isAccessCodeEnabled || isAccessCode}
      isPromoEnabled={isPromoEnabled}
      isUserLogged={isUserLogged}
      onPressMyOrders={onPressMyOrders}
      onPressLogout={handleOnLogout}
      areLoadingIndicatorsEnabled={areLoadingIndicatorsEnabled}
      onAddToWaitingListError={onAddToWaitingListError}
      onAddToWaitingListSuccess={onAddToWaitingListSuccess}
      onLoadingChange={handleOnLoadingChange}
      promoCodeCloseIcon={promoCodeCloseIcon}
    />
  )
}

export default Tickets
