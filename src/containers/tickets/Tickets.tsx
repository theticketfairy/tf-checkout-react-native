import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _some from 'lodash/some'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import {
  IEventResponse,
  IFetchTicketsResponse,
  IPromoCodeResponse,
} from '../../api/types'
import { TicketsCore, TicketsCoreHandle } from '../../core'
import { IBookTicketsOptions } from '../../core/TicketsCore/TicketsCoreTypes'
import {
  IAddToCartResponse,
  IEvent,
  IOnFetchTicketsSuccess,
  ISelectedTicket,
  ITicket,
} from '../../types'
import TicketsView from './TicketsView'
import { ITicketsProps } from './types'

const Tickets: FC<ITicketsProps> = ({
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
}) => {
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

  //#region Refs
  const eventErrorCodeRef = useRef(0)
  const ticketsCoreRef = useRef<TicketsCoreHandle>(null)
  const isApiErrorRef = useRef<boolean>(false)
  //#endregion

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
    if (!ticketsCoreRef.current) {
      return { eventError: { message: 'Ticket core is not initialized' } }
    }

    setIsUserLogged(await ticketsCoreRef.current.getIsUserLoggedIn())
  }

  const getTicketsCore = async (
    promoCode?: string
  ): Promise<IFetchTicketsResponse> => {
    if (!ticketsCoreRef.current) {
      return { error: { message: 'Ticket core is not initialized' } }
    }

    return await ticketsCoreRef.current.getTickets(promoCode)
  }

  const getEventCore = async (): Promise<IEventResponse> => {
    if (!ticketsCoreRef.current) {
      return { eventError: { message: 'Ticket core is not initialized' } }
    }

    return await ticketsCoreRef.current.getEvent()
  }

  const addToCartCore = async (
    data: IBookTicketsOptions
  ): Promise<IAddToCartResponse> => {
    if (!ticketsCoreRef.current) {
      return { error: { message: 'Ticket core is not initialized' } }
    }

    return await ticketsCoreRef.current.addToCart(data)
  }

  const getTickets = async (promoCode: string = '') => {
    setIsGettingTickets(true)
    isApiErrorRef.current = false
    const {
      error,
      tickets: responseTickets,
      promoCodeResult,
      isInWaitingList,
      isAccessCodeRequired,
    } = await getTicketsCore(promoCode)
    setIsGettingTickets(false)

    if (error) {
      onFetchTicketsError?.(error)
      isApiErrorRef.current = true
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
    if (isApiErrorRef.current === true) {
      return
    }
    setIsGettingEvent(true)
    const { eventError, eventData } = await getEventCore()
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

    const ticketQuantity =
      typeof selectedTicket.selectedOption.value === 'string'
        ? parseInt(selectedTicket.selectedOption.value, 10)
        : selectedTicket.selectedOption.value

    const ticketsOptions: IBookTicketsOptions = {
      quantity: ticketQuantity,
      optionName: _get(selectedTicket, 'optionName'),
      ticketId: _get(selectedTicket, 'id'),
      price: selectedTicket.price,
    }

    setIsBooking(true)
    const { data: result, error: addToCartError } = await addToCartCore(
      ticketsOptions
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
    if (!ticketsCoreRef.current) {
      return { error: { message: 'Ticket core is not initialized' } }
    }

    await ticketsCoreRef.current.logout()
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
    <TicketsCore ref={ticketsCoreRef}>
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
    </TicketsCore>
  )
}

export default Tickets
