import _map from 'lodash/map'
import _sortBy from 'lodash/sortBy'
import _uniqBy from 'lodash/uniqBy'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import { fetchMyOrders, fetchOrderDetails } from '../../api/ApiClient'
import { IMyOrdersOrder } from '../../api/types'
import { IDropdownItem } from '../../components/dropdown/types'
import MyOrdersView from './MyOrdersView'
import { IMyOrdersProps } from './types'

const MyOrders: FC<IMyOrdersProps> = ({
  onSelectOrder,
  onFetchOrderDetailsFail,
  styles,
  config,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isGettingEventDetails, setIsGettingEventDetails] = useState(false)
  const [myEvents, setMyEvents] = useState<IDropdownItem[]>([])
  const [selectedEvent, setSelectedEvent] = useState<IDropdownItem>({
    label: 'Select event',
    value: '-1',
  })
  const [myOrders, setMyOrders] = useState<IMyOrdersOrder[]>([])
  const currentPage = useRef(1)

  const getOrdersAsync = async (): Promise<undefined | IMyOrdersOrder[]> => {
    setIsLoading(true)
    const validSelectedEvent =
      selectedEvent.value === '-1' ? null : selectedEvent
    const { myOrdersData, myOrdersError } = await fetchMyOrders(
      currentPage.current,
      validSelectedEvent?.value.toString()
    )
    setIsLoading(false)
    if (myOrdersError || !myOrdersData) {
      Alert.alert('', myOrdersError)
      return undefined
    }

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
  }, [selectedEvent])

  //#region Handlers
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
    if ((!orderDetailsData || orderDetailsError) && onFetchOrderDetailsFail) {
      return onFetchOrderDetailsFail(orderDetailsError!)
    }
    if (orderDetailsData) {
      onSelectOrder(orderDetailsData)
    }
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    const _fetchMyOrders = async () => {
      await getOrders()
    }
    _fetchMyOrders()
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
    />
  )
}

export default MyOrders
