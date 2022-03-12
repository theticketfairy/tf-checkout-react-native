import _map from 'lodash/map'
import _sortBy from 'lodash/sortBy'
import _uniqBy from 'lodash/uniqBy'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import { fetchMyOrders, fetchOrderDetails } from '../../api/ApiClient'
import { IMyOrdersOrder } from '../../api/types'
import { IDropdownItem } from '../../components/dropdown/types'
import { IError } from '../../types'
import MyOrdersView from './MyOrdersView'
import { IMyOrdersProps } from './types'

const MyOrders: FC<IMyOrdersProps> = ({
  onSelectOrder,
  onFetchOrderDetailsError,
  onFetchMyOrdersError,
  onFetchMyOrdersSuccess,
  onFetchOrderDetailsSuccess,
  onLoadingChange,
  styles,
  texts,
  config,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isGettingEventDetails, setIsGettingEventDetails] = useState(false)
  const [myEvents, setMyEvents] = useState<IDropdownItem[]>([])
  const [selectedEvent, setSelectedEvent] = useState<IDropdownItem>({
    label: texts?.selectEventPlaceholder || 'Select event',
    value: '-1',
  })
  const [myOrders, setMyOrders] = useState<IMyOrdersOrder[]>([])
  const currentPage = useRef(1)

  const showAlert = (text: string) => {
    if (config?.areAlertsEnabled) {
      Alert.alert('', text)
    }
  }

  const getOrdersAsync = async (): Promise<undefined | IMyOrdersOrder[]> => {
    setIsLoading(true)
    const validSelectedEvent =
      selectedEvent.value === '-1' ? null : selectedEvent
    const { myOrdersData, myOrdersError } = await fetchMyOrders(
      currentPage.current,
      validSelectedEvent?.value.toString()
    )
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

    onFetchMyOrdersSuccess?.()

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

    return myOrdersData.orders
  }

  const getOrders = async () => {
    const fetchedOrders = await getOrdersAsync()
    setMyOrders(fetchedOrders ?? [])
  }

  const getMoreOrders = async () => {
    const fetchedOrders = await getOrdersAsync()
    const uniqOrders = _uniqBy(
      [...myOrders, ...(fetchedOrders ?? [])],
      (item) => item.id
    )
    setMyOrders(uniqOrders)
  }

  useEffect(() => {
    getOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent])

  //#region Handlers
  const handleOnLoadingChange = useCallback(
    (loading: boolean) => {
      onLoadingChange?.(loading)
    },
    [onLoadingChange]
  )

  const handleOnChangeEvent = (event: IDropdownItem) => {
    if (event.value !== selectedEvent.value) {
      currentPage.current = 1
      setSelectedEvent(event)
    }
  }

  const handleOnFetchMoreOrders = () => {
    if (myOrders.length < 8) {
      return
    }
    currentPage.current = currentPage.current + 1
    getMoreOrders()
  }

  const handleOnSelectOrder = async (order: IMyOrdersOrder) => {
    setIsGettingEventDetails(true)
    const { orderDetailsData, orderDetailsError } = await fetchOrderDetails(
      order.id
    )
    setIsGettingEventDetails(false)
    if ((!orderDetailsData || orderDetailsError) && onFetchOrderDetailsError) {
      showAlert(orderDetailsError?.message ?? 'Error fetching order details')
      return onFetchOrderDetailsError(
        orderDetailsError || {
          message: 'Order details returned no data',
        }
      )
    }

    if (orderDetailsData) {
      onFetchOrderDetailsSuccess?.()
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
  //#endregion

  return (
    <MyOrdersView
      myEvents={myEvents}
      selectedEvent={selectedEvent}
      onChangeEvent={handleOnChangeEvent}
      myOrders={myOrders}
      onSelectOrder={handleOnSelectOrder}
      onRefresh={getOrders}
      isLoading={isLoading}
      isGettingEventDetails={isGettingEventDetails}
      styles={styles}
      config={config}
      onFetchMoreOrders={handleOnFetchMoreOrders}
      texts={texts}
    />
  )
}

export default MyOrders
