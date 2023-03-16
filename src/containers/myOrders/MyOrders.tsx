import _map from 'lodash/map'
import _sortBy from 'lodash/sortBy'
import _uniqBy from 'lodash/uniqBy'
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
  IFetchAccessTokenResponse,
  IMyOrdersData,
  IMyOrdersOrder,
  IMyOrdersRequestParams,
  MyOrderRequestFromType,
} from '../../api/types'
import { IDropdownItem } from '../../components/dropdown/types'
import { MyOrdersCore, MyOrdersCoreHandle, SessionHandle } from '../../core'
import { SessionHandleType } from '../../core/Session/SessionCoreTypes'
import { IError } from '../../types'
import MyOrdersView from './MyOrdersView'
import { IMyOrdersProps } from './types'

const MyOrders = forwardRef<SessionHandleType, IMyOrdersProps>(
  (
    {
      onSelectOrder,
      onFetchOrderDetailsError,
      onFetchMyOrdersError,
      onFetchMyOrdersSuccess,
      onFetchOrderDetailsSuccess,
      onLoadingChange,
      styles,
      texts,
      config,
    },
    ref
  ) => {
    //#region State
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isGettingEventDetails, setIsGettingEventDetails] = useState(false)
    const [myEvents, setMyEvents] = useState<IDropdownItem[]>([])
    const [selectedEvent, setSelectedEvent] = useState<IDropdownItem>({
      label: texts?.selectEventPlaceholder || 'Select event',
      value: '',
    })

    const [selectedTimeFilter, setSelectedTimeFilter] = useState<IDropdownItem>(
      {
        label: texts?.selectTimeFilterPlaceholder || 'Select time filter',
        value: '',
      }
    )
    const [myOrders, setMyOrders] = useState<IMyOrdersOrder[]>([])
    //#endregion

    const timeFilters: IDropdownItem[] = [
      {
        label: texts?.timeFilters?.upcoming || 'Upcoming events',
        value: 'upcoming_events',
      },
      {
        label:
          texts?.timeFilters?.ongoingAndUpcoming ||
          'Ongoing and upcoming events',
        value: 'ongoing_and_upcoming_events',
      },
      {
        label: texts?.timeFilters?.ongoing || 'Ongoing events',
        value: 'ongoing_events',
      },
      {
        label: texts?.timeFilters?.past || 'Past events',
        value: 'past_events',
      },
    ]

    //#region Refs
    const currentPage = useRef(1)
    const myOrdersCoreRef = useRef<MyOrdersCoreHandle>(null)
    const sessionHandleRef = useRef<SessionHandleType>(null)
    //#endregion

    const showAlert = (text: string) => {
      if (config?.areAlertsEnabled) {
        Alert.alert('', text)
      }
    }

    const isMyOrdersCoreRefReady = (): boolean => {
      if (!myOrdersCoreRef.current) {
        onFetchMyOrdersError?.({
          message: 'MyOrdersCore is not initialized',
        })
        showAlert('MyOrdersCore is not initialized')
        return false
      }

      return true
    }

    //#region Fetch data
    const getOrdersAsync = async (): Promise<undefined | IMyOrdersData> => {
      if (!isMyOrdersCoreRefReady()) {
        return
      }

      setIsLoading(true)
      const validSelectedEvent =
        selectedEvent.value === '' ? null : selectedEvent

      const myOrdersRequestParams: IMyOrdersRequestParams = {
        limit: 20,
        page: currentPage.current,
        filter:
          validSelectedEvent?.value.toString() === 'none'
            ? ''
            : validSelectedEvent?.value.toString(),
        from:
          selectedTimeFilter.value === 'none'
            ? ''
            : (selectedTimeFilter.value as MyOrderRequestFromType),
      }

      const { myOrdersData, myOrdersError } =
        await myOrdersCoreRef.current!.getMyOrders(myOrdersRequestParams)

      setIsLoading(false)

      if (myOrdersError) {
        onFetchMyOrdersError?.(myOrdersError)
        showAlert(myOrdersError.message)
        return undefined
      }

      if (!myOrdersData) {
        const altError: IError = {
          message: 'My orders returned no data',
        }
        onFetchMyOrdersError?.(altError)
        showAlert(altError.message)
        return undefined
      }

      onFetchMyOrdersSuccess?.(myOrdersData)

      const events = _sortBy(
        _map(myOrdersData.events, (item) => {
          return {
            label: item.event_name,
            value: item.url_name,
          }
        }),
        'value'
      )

      setMyEvents(events)

      return myOrdersData
    }

    const getOrders = async () => {
      const fetchedOrders = await getOrdersAsync()
      setMyOrders(fetchedOrders?.orders ?? [])
    }

    const getMoreOrders = async () => {
      const fetchedOrders = await getOrdersAsync()
      const uniqOrders = _uniqBy(
        [...myOrders, ...(fetchedOrders?.orders ?? [])],
        (item) => item.id
      )
      setMyOrders(uniqOrders)
    }
    //#endregion Fetch data

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
          await getOrders()
        }
        return {
          accessTokenData,
          accessTokenError,
        }
      },

      async reloadData() {
        await getOrders()
      },
    }))
    //#endregion Imperative Handler

    //#region Handlers
    const handleOnRefresh = async () => {
      setIsRefreshing(true)
      await getOrders()
      setIsRefreshing(false)
    }

    const handleOnLoadingChange = useCallback(
      (loading: boolean) => {
        onLoadingChange?.(loading)
      },
      [onLoadingChange]
    )

    const handleOnChangeTimeFilter = (item: IDropdownItem) => {
      setMyOrders([])
      setSelectedEvent({
        label: texts?.selectEventPlaceholder || 'Select event',
        value: '',
      })

      if (item.value !== selectedTimeFilter.value) {
        currentPage.current = 1
        setSelectedTimeFilter(item)
      }
    }

    const handleOnChangeEvent = (event: IDropdownItem) => {
      setMyOrders([])

      if (event.value !== selectedEvent.value || event.value === '') {
        currentPage.current = 1
        setSelectedEvent(event)
      }
    }

    const handleOnFetchMoreOrders = () => {
      if (myOrders.length < 8) {
        return
      }
      if (!isLoading) {
        currentPage.current = currentPage.current + 1
        getMoreOrders()
      }
    }

    const handleOnSelectOrder = async (order: IMyOrdersOrder) => {
      if (!isMyOrdersCoreRefReady()) {
        return
      }

      setIsGettingEventDetails(true)

      const { orderDetailsData, orderDetailsError } =
        await myOrdersCoreRef.current!.getOrderDetails(order.id)

      setIsGettingEventDetails(false)

      if (
        (!orderDetailsData || orderDetailsError) &&
        onFetchOrderDetailsError
      ) {
        showAlert(orderDetailsError?.message ?? 'Error fetching order details')
        return onFetchOrderDetailsError(
          orderDetailsError || {
            message: 'Order details returned no data',
          }
        )
      }

      if (orderDetailsData) {
        onFetchOrderDetailsSuccess?.(orderDetailsData)
        onSelectOrder(orderDetailsData)
      }
    }
    //#endregion

    //#region useEffect
    useEffect(() => {
      handleOnLoadingChange(isLoading || isGettingEventDetails)
    }, [handleOnLoadingChange, isLoading, isGettingEventDetails])

    useEffect(() => {
      const _fetchMyOrders = async () => {
        await getOrders()
      }
      _fetchMyOrders()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (selectedEvent.value !== '' || selectedTimeFilter.value !== '') {
        getOrders()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEvent, selectedTimeFilter])
    //#endregion useEffect

    //#region Return
    return (
      <MyOrdersCore ref={myOrdersCoreRef}>
        <SessionHandle ref={sessionHandleRef}>
          <MyOrdersView
            myEvents={myEvents}
            selectedEvent={selectedEvent}
            onChangeEvent={handleOnChangeEvent}
            myOrders={myOrders}
            onSelectOrder={handleOnSelectOrder}
            onRefresh={handleOnRefresh}
            isLoading={isLoading}
            isGettingEventDetails={isGettingEventDetails}
            styles={styles}
            config={config}
            onFetchMoreOrders={handleOnFetchMoreOrders}
            texts={texts}
            timeFilters={timeFilters}
            selectedTimeFilter={selectedTimeFilter}
            onChangeTimeFilter={handleOnChangeTimeFilter}
            isRefreshing={isRefreshing}
          />
        </SessionHandle>
      </MyOrdersCore>
    )
    //#endregion Return
  }
)

export default MyOrders
