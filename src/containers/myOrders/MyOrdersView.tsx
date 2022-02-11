import React, { useCallback, useMemo } from 'react'
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { IMyOrdersOrder } from '../../api/types'
import { Dropdown, Loading } from '../../components'
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

  const renderOrderListItem = useCallback(
    ({ item }) => (
      <OrderListItem
        order={item}
        onSelectOrder={handleOnSelectOrder}
        styles={styles?.orderListItem}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleOnSelectOrder]
  )

  const renderRefreshControl = useMemo(
    () => (
      <RefreshControl
        tintColor={styles?.refreshControlColor || R.colors.primary}
        refreshing={!!isLoading}
        onRefresh={onRefresh}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, onRefresh]
  )

  const dropdownStyles = useMemo(() => {
    return {
      container: s.eventsDropdownContainer,
      button: s.eventsDropdownButton,
      label: {
        maxWidth: '75%',
      },
      ...styles?.eventsDropdown,
    }
  }, [styles?.eventsDropdown])

  const onClearSelectedEvent = () =>
    onChangeEvent({
      label: 'Select event',
      value: '-1',
    })

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <SafeAreaView style={[s.safeArea, styles?.safeArea]}>
        <View style={[s.eventsContainer, styles?.eventsContainer]}>
          <Text style={[s.eventsTitle, styles?.eventsTitle]}>Events</Text>
          <View
            style={[
              s.eventsSelectionContainer,
              styles?.eventsSelectionContainer,
            ]}
          >
            <Dropdown
              items={myEvents}
              onSelectItem={onChangeEvent}
              selectedOption={selectedEvent}
              styles={dropdownStyles}
            />
            <TouchableOpacity onPress={onClearSelectedEvent}>
              <Image
                source={R.icons.error}
                style={[
                  s.clearEventSelectionIcon,
                  styles?.clearEventSelectionIcon,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[s.listContainer, styles?.listContainer]}>
          <FlatList
            data={myOrders}
            renderItem={renderOrderListItem}
            refreshControl={renderRefreshControl}
          />
        </View>
        {isGettingEventDetails && <Loading />}
      </SafeAreaView>
    </View>
  )
}

export default MyOrdersView
