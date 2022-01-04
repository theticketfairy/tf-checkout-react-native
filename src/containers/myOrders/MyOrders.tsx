import _map from 'lodash/map'
import React, { FC, useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { fetchMyOrders, fetchOrderDetails } from '../../api/ApiClient'
import { IMyOrdersOrder } from '../../api/types'
import { IDropdownItem } from '../../components/dropdown/types'
import MyOrdersView from './MyOrdersView'

export interface IMyOrdersProps {
  onDismissMyOrders: () => void
}

const MyOrders: FC<IMyOrdersProps> = ({ onDismissMyOrders }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isGettingEventDetails, setIsGettingEventDetails] = useState(false)
  const [myEvents, setMyEvents] = useState<IDropdownItem[]>([])
  const [selectedEvent, setSelectedEvent] = useState<IDropdownItem>()
  const [myOrders, setMyOrders] = useState<IMyOrdersOrder[]>([])

  const getMyOrdersAsync = async () => {
    setIsLoading(true)
    const { myOrdersData, myOrdersError } = await fetchMyOrders()
    console.log('MyOrdersData', myOrdersData)
    console.log('myOrdersError', myOrdersError)
    if (myOrdersError || !myOrdersData) {
      return Alert.alert('', myOrdersError)
    }

    const events: IDropdownItem[] = _map(myOrdersData.events, (item) => {
      return {
        label: item.event_name,
        value: item.url_name,
      }
    })

    setMyOrders(myOrdersData.orders)
    setMyEvents(events)
    setIsLoading(false)
  }

  //#region Handlers
  const handleOnChangeEvent = (event: IDropdownItem) => {
    setSelectedEvent(event)
  }

  const handleOnSelectOrder = async (order: IMyOrdersOrder) => {
    setIsGettingEventDetails(true)
    const orderDetails = await fetchOrderDetails(order.id)
    setIsGettingEventDetails(false)
    console.log('Order Details', orderDetails)
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchData = async () => {
      await getMyOrdersAsync()
    }

    fetchData()
  }, [])

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
      onGoBack={onDismissMyOrders}
      isGettingEventDetails={isGettingEventDetails}
    />
  )
}

export default MyOrders
