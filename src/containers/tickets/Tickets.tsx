import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _some from 'lodash/some'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Alert } from 'react-native'

import {
  IEventResponse,
  IFetchAccessTokenResponse,
  IPromoCodeResponse,
} from '../../api/types'
import { SessionHandle, TicketsCore, TicketsCoreHandle } from '../../core'
import { SessionHandleType } from '../../core/Session/SessionCoreTypes'
import {
  IBookTicketsOptions,
  IGetTicketsPayload,
  IGroupedTickets,
} from '../../core/TicketsCore/TicketsCoreTypes'
import {
  IAddToCartResponse,
  IEvent,
  IOnFetchTicketsSuccess,
  ISelectedTicket,
  ITicket,
} from '../../types'
import TicketsView from './TicketsView'
import { IPasswordProtectedEventData, ITicketsProps } from './types'

const Tickets = forwardRef<SessionHandleType, ITicketsProps>(
  (
    {
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
      onFetchEventSuccess,
      onAddToWaitingListError,
      onAddToWaitingListSuccess,
      promoCodeCloseIcon,
      isCheckingCurrentSession,
      config = {
        areTicketsGrouped: true,
        areActivityIndicatorsEnabled: true,
        areAlertsEnabled: true,
        areTicketsSortedBySoldOut: true,
      },
    },
    ref
  ) => {
    const [isUserLogged, setIsUserLogged] = useState(false)
    const [isGettingTickets, setIsGettingTickets] = useState(false)
    const [isGettingEvent, setIsGettingEvent] = useState(false)
    const [event, setEvent] = useState<IEvent>()
    const [isBooking, setIsBooking] = useState(false)
    const [areTicketGroupsShown, setAreTicketGroupsShown] = useState(false)
    const [tickets, setTickets] = useState<ITicket[]>([])
    const [groupedTickets, setGroupedTickets] = useState<IGroupedTickets[]>([])
    const [isWaitingListVisible, setIsWaitingListVisible] = useState(false)
    const [isAccessCode, setIsAccessCode] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<ISelectedTicket>()
    const [promoCodeResponse, setPromoCodeResponse] = useState<
      IPromoCodeResponse | undefined
    >(undefined)
    const [isFirstCall, setIsFirstCall] = useState(true)
    const [passwordProtectedEventData, setPasswordProtectedEventData] =
      useState<IPasswordProtectedEventData | undefined>()

    //#region Refs
    const eventErrorCodeRef = useRef(0)
    const ticketsCoreRef = useRef<TicketsCoreHandle>(null)
    const sessionHandleRef = useRef<SessionHandleType>(null)
    const isApiErrorRef = useRef<boolean>(false)
    //#endregion Refs

    const showAlert = (message: string) => {
      if (config.areAlertsEnabled) {
        Alert.alert('', message)
      }
    }

    const isTicketOnSale = (ticketsForCheck: ITicket[]) =>
      _some(
        ticketsForCheck,
        (item: ITicket) =>
          item.salesStarted && !item.salesEnded && !item.soldOut
      )

    const areTicketsOnSale = (): boolean => {
      if (event?.salesEnded) {
        return false
      }

      if (
        config.areTicketsGrouped &&
        areTicketGroupsShown &&
        groupedTickets.length === 0
      ) {
        return false
      }

      if (!config.areTicketsGrouped && tickets.length === 0) {
        return false
      }

      if (config.areTicketsGrouped) {
        return _some(groupedTickets, (gTicket) => isTicketOnSale(gTicket.data))
      } else {
        return isTicketOnSale(tickets)
      }
    }

    //#region Core Api calls
    const retrieveStoredAccessToken = async () => {
      if (!ticketsCoreRef.current) {
        return { eventError: { message: 'Ticket core is not initialized' } }
      }

      setIsUserLogged(await ticketsCoreRef.current.getIsUserLoggedIn())
    }

    const getTicketsCore = async (
      promoCode?: string
    ): Promise<IGetTicketsPayload> => {
      if (!ticketsCoreRef.current) {
        return { error: { message: 'Ticket core is not initialized' } }
      }

      return await ticketsCoreRef.current.getTickets({
        promoCode,
        areTicketsSortedBySoldOut: config.areTicketsSortedBySoldOut,
        areTicketsGrouped: config.areTicketsGrouped,
      })
    }

    const unlockPasswordProtectedEventCore = async (
      password: string
    ): Promise<IEventResponse> => {
      if (!ticketsCoreRef.current) {
        return { eventError: { message: 'Ticket core is not initialized' } }
      }

      return await ticketsCoreRef.current.unlockPasswordProtectedEvent(password)
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
    //#endregion Core Api calls

    //#region Fetch Initial Data
    const fetchInitialData = async () => {
      await retrieveStoredAccessToken()
      await getEventData()
    }
    //#endregion Fetch Initial Data

    //#region Api Calls
    const getTickets = async (promoCode: string = '') => {
      setIsGettingTickets(true)
      isApiErrorRef.current = false
      const {
        error,
        tickets: responseTickets,
        promoCodeResult,
        isInWaitingList,
        isAccessCodeRequired,
        areGroupsShown,
      } = await getTicketsCore(promoCode)
      setIsGettingTickets(false)

      if (error) {
        onFetchTicketsError?.(error)
        isApiErrorRef.current = true
        return showAlert('Error while getting tickets, please try again')
      }

      setIsWaitingListVisible(!!isInWaitingList)
      setIsAccessCode(!!isAccessCodeRequired)
      setAreTicketGroupsShown(areGroupsShown || false)

      if (responseTickets && !_isEmpty(responseTickets)) {
        if (config.areTicketsGrouped) {
          if (areGroupsShown) {
            setGroupedTickets(responseTickets as IGroupedTickets[])
          } else {
            setTickets(responseTickets as ITicket[])
          }
        } else {
          setTickets(responseTickets as ITicket[])
        }

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
          areTicketsGroupsShown: areGroupsShown,
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
        if (eventError.code === 401) {
          setPasswordProtectedEventData({
            isPasswordProtected: true,
            message: eventError.message,
          })
        } else {
          showAlert(eventError.message)
        }
        return onFetchEventError?.(
          eventError || { message: 'There was an error while fetching event' }
        )
      }

      eventErrorCodeRef.current = 0

      if (!eventData) {
        return onFetchEventError?.({
          message: 'There was an error while fetching event',
        })
      }

      await getTickets()

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
        showAlert(
          addToCartError.message || 'Error while adding tickets to cart'
        )
        return onAddToCartError?.(addToCartError)
      }
    }
    //#endregion Api Calls

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
      if (!isCheckingCurrentSession && isFirstCall) {
        fetchInitialData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCheckingCurrentSession])
    //#endregion UseEffects

    //#region Imperative Handler
    useImperativeHandle(ref, () => ({
      async refreshAccessToken(
        refreshToken: string
      ): Promise<IFetchAccessTokenResponse> {
        if (!sessionHandleRef.current) {
          return {
            accessTokenError: {
              message: 'Session Handle ref is not initialized',
            },
          }
        }

        const { accessTokenError, accessTokenData } =
          await sessionHandleRef.current!.refreshAccessToken(refreshToken)
        if (!accessTokenError && accessTokenData?.accessToken) {
          await fetchInitialData()
        }
        return {
          accessTokenData,
          accessTokenError,
        }
      },

      async reloadData() {
        await fetchInitialData()
      },
    }))
    //#endregion Imperative Handler

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

      await getEventData()
      onPressLogout?.()
    }

    const handleOnLoadingChange = (loading: boolean) => {
      onLoadingChangeCallback(loading)
    }

    const handleOnSubmitEventPassword = async (password: string) => {
      setPasswordProtectedEventData({
        ...passwordProtectedEventData,
        isLoading: true,
      })

      const { eventData, eventError } = await unlockPasswordProtectedEventCore(
        password
      )

      if (eventError) {
        return setPasswordProtectedEventData({
          ...passwordProtectedEventData,
          isLoading: false,
          apiError: eventError.message,
        })
      }

      setPasswordProtectedEventData({
        ...passwordProtectedEventData,
        isLoading: false,
        apiError: '',
        isPasswordProtected: false,
        message: '',
      })
      eventErrorCodeRef.current = 0

      onFetchEventSuccess?.(eventData!)
      setEvent(eventData)
      getTickets()
    }
    //#endregion

    //#region RENDER
    return (
      <TicketsCore ref={ticketsCoreRef}>
        <SessionHandle ref={sessionHandleRef}>
          <TicketsView
            isGettingTickets={isGettingTickets}
            tickets={tickets}
            groupedTickets={groupedTickets}
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
            isGetTicketsButtonVisible={areTicketsOnSale()}
            isAccessCodeEnabled={isAccessCodeEnabled || isAccessCode}
            isPromoEnabled={isPromoEnabled}
            isUserLogged={isUserLogged}
            onPressMyOrders={onPressMyOrders}
            onPressLogout={handleOnLogout}
            areLoadingIndicatorsEnabled={config.areActivityIndicatorsEnabled}
            onAddToWaitingListError={onAddToWaitingListError}
            onAddToWaitingListSuccess={onAddToWaitingListSuccess}
            onLoadingChange={handleOnLoadingChange}
            promoCodeCloseIcon={promoCodeCloseIcon}
            areTicketsGroupsShown={areTicketGroupsShown}
            passwordProtectedEventData={passwordProtectedEventData}
            onPressSubmitEventPassword={handleOnSubmitEventPassword}
            isCheckingCurrentSession={isCheckingCurrentSession}
          />
        </SessionHandle>
      </TicketsCore>
    )
    //#endregion RENDER
  }
)

export default Tickets
