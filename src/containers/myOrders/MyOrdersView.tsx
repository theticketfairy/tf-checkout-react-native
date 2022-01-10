import React from 'react'
import {
  FlatList,
  Modal,
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
  onGoBack,
  goBackButtonText,
  isGettingEventDetails,
}: IMyOrdersViewProps) => {
  const handleOnSelectOrder = (order: IMyOrdersOrder) => {
    if (onSelectOrder) {
      onSelectOrder(order)
    }
  }

  return (
    <Modal>
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
          <Button
            text={goBackButtonText || 'Go back'}
            onPress={onGoBack}
            styles={{
              container: s.backButtonContainer,
              ...styles?.goBackButton,
            }}
          />
        </View>
        {isGettingEventDetails && <Loading />}
      </SafeAreaView>
    </Modal>
  )
}

export default MyOrdersView
