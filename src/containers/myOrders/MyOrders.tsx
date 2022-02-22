import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import React, { FC, useCallback, useEffect, useState } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const getMyOrdersAsync = useCallback(async () => {
    setIsLoading(true)
    const validSelectedEvent =
      selectedEvent.value === '-1' ? null : selectedEvent
    const { myOrdersData, myOrdersError } = await fetchMyOrders(
      currentPage,
      validSelectedEvent?.value.toString()
    )

    if (myOrdersError || !myOrdersData) {
      return Alert.alert('', myOrdersError)
    }

    const events: IDropdownItem[] = _map(myOrdersData.events, (item) => {
      return {
        label: item.event_name,
        value: item.url_name,
      }
    })

    setMyOrders([...myOrders, ...myOrdersData.orders])
    setMyEvents(events)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, currentPage])

  //#region Handlers
  const handleOnChangeEvent = (event: IDropdownItem) => {
    if (event.value !== selectedEvent.value) {
      setSelectedEvent(event)
    }
  }

  const handleOnSelectOrder = async (order: IMyOrdersOrder) => {
    setIsGettingEventDetails(true)
    console.log(' My orders, handle on select orter', order)
    const { orderDetailsData, orderDetailsError } = await fetchOrderDetails(
      order.id
    )
    console.log(' My orders, handle on fetch order det', orderDetailsData)
    setIsGettingEventDetails(false)

    if (!orderDetailsData || orderDetailsError) {
      if (onFetchOrderDetailsFail) {
        return onFetchOrderDetailsFail(
          orderDetailsError || 'Error fetching order details'
        )
      }
    }

    if (orderDetailsData) {
      const orderDetails = { ...orderDetailsData }
      _forEach(orderDetails.tickets, (ticket, index) => {
        console.log('Tuicke', ticket)
        orderDetailsData.tickets[index].eventName = order.eventName
      })

      console.log('==> orderDetails', orderDetails)
      return onSelectOrder(orderDetailsData)
    }
  }

  const handleOnFetchMoreOrders = () => {
    setCurrentPage(currentPage + 1)
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (selectedEvent?.value) {
      getMyOrdersAsync()
    }
  }, [getMyOrdersAsync, selectedEvent])

  useEffect(() => {
    if (myEvents.length > 0) {
    }
  }, [myEvents])
  //#endregion

  return (
    <MyOrdersView
      myEvents={myEvents}
      selectedEvent={selectedEvent}
      onChangeEvent={handleOnChangeEvent}
      myOrders={myOrders}
      onSelectOrder={handleOnSelectOrder}
      onRefresh={getMyOrdersAsync}
      isLoading={isLoading}
      isGettingEventDetails={isGettingEventDetails}
      styles={styles}
      config={config}
      onFetchMoreOrders={handleOnFetchMoreOrders}
    />
  )
}

export default MyOrders
