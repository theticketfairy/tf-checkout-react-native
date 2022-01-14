import React from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native'

import { IMyOrdersOrder } from '../../api/types'
import { Button, Dropdown, Loading } from '../../components'
import R from '../../res'
import OrderListItem from './components/OrderListItem'
import { MyOrdersViewStyles as s } from './styles'
import { IMyOrdersViewProps } from './types'

const MyOrdersView = ({
  myEvents,
  onChangeEvent,
  selectedEvent,
  myOrders,
  onSelectOrder,
  styles,
  isLoading,
  onRefresh,
  isGettingEventDetails,
}: IMyOrdersViewProps) => {
  const handleOnSelectOrder = (order: IMyOrdersOrder) => {
    if (onSelectOrder) {
      onSelectOrder(order)
    }
  }

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <SafeAreaView style={[s.safeArea, styles?.safeArea]}>
        <View style={[s.eventsContainer, styles?.eventsContainer]}>
          <Text style={[s.eventsTitle, styles?.eventsTitle]}>Events</Text>
          <Dropdown
            items={myEvents}
            onSelectItem={onChangeEvent}
            selectedOption={selectedEvent}
            styles={{
              container: s.eventsDropdownContainer,
              label: {
                maxWidth: '80%',
              },
              ...styles?.eventsDropdown,
            }}
          />
        </View>
        <View style={[s.listContainer, styles?.listContainer]}>
          <FlatList
            data={myOrders}
            renderItem={({ item }) => (
              <OrderListItem
                order={item}
                onSelectOrder={handleOnSelectOrder}
                styles={styles?.orderListItem}
              />
            )}
            refreshControl={
              <RefreshControl
                tintColor={styles?.refreshControlColor || R.colors.primary}
                refreshing={!!isLoading}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
        {isGettingEventDetails && <Loading />}
      </SafeAreaView>
    </View>
  )
}

export default MyOrdersView
