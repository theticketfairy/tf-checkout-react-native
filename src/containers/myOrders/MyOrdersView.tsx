import React, { useCallback, useMemo, useRef } from 'react'
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
  config,
  onFetchMoreOrders,
  texts,
}: IMyOrdersViewProps) => {
  const onEndReachedCalledDuringMomentum = useRef(false)
  const handleOnSelectOrder = (order: IMyOrdersOrder) => {
    if (onSelectOrder) {
      onSelectOrder(order)
    }
  }

  const handleOnReachEnd = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      onFetchMoreOrders()
      onEndReachedCalledDuringMomentum.current = true
    }
  }

  const handleOnMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false
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
      label: texts?.selectEventPlaceholder || 'Select event',
      value: '-1',
    })

  const eventsDropdown = (
    <View style={[s.eventsContainer, styles?.eventsContainer]}>
      <Text style={[s.eventsTitle, styles?.eventsTitle]}>
        {texts?.title || 'Events'}
      </Text>
      <View
        style={[s.eventsSelectionContainer, styles?.eventsSelectionContainer]}
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
            style={[s.clearEventSelectionIcon, styles?.clearEventSelectionIcon]}
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <SafeAreaView style={[s.safeArea, styles?.safeArea]}>
        {!config?.isEventsDropdownHidden && eventsDropdown}
        <View style={[s.listContainer, styles?.listContainer]}>
          <FlatList
            data={myOrders}
            renderItem={renderOrderListItem}
            refreshControl={renderRefreshControl}
            onEndReached={handleOnReachEnd}
            onMomentumScrollBegin={handleOnMomentumScrollBegin}
            onEndReachedThreshold={0.2}
            extraData={myOrders}
          />
        </View>
        {config?.areActivityIndicatorsEnabled && isGettingEventDetails && (
          <Loading />
        )}
      </SafeAreaView>
    </View>
  )
}

export default MyOrdersView
