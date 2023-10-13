import React, { type FC, useCallback, useMemo, useRef } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { IMyOrdersOrder } from '../../api/types'
import { Dropdown, Loading } from '../../components'
import R from '../../res'
import OrderListItem from './components/OrderListItem'
import { MyOrdersViewStyles as s } from './styles'
import type { IMyOrdersViewProps } from './types'
import type { IDropdownStyles } from '../../components/dropdown/types'



const MyOrdersView: FC<IMyOrdersViewProps> = ({
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
  onChangeTimeFilter,
  timeFilters,
  selectedTimeFilter,
  isRefreshing,
}) => {
  const onEndReachedCalledDuringMomentum = useRef(false)
  //#region Handlers
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
  //#endregion Handlers

  //#region Renders
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

  const renderRefreshControl = (
    <RefreshControl
      enabled={false}
      tintColor={styles?.refreshControlColor || R.colors.primary}
      refreshing={!!isLoading}
      onRefresh={onRefresh}
    />
  )

  const dropdownStyles: IDropdownStyles = useMemo(() => {
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
      value: 'none',
    })

  const onClearSelectedTimeFilter = () =>
    onChangeTimeFilter({
      label: texts?.selectTimeFilterPlaceholder || 'Select time filter',
      value: 'none',
    })

  const eventsDropdown = (
    <View style={[s.eventsContainer, styles?.eventsContainer]}>
      <View
        style={[s.eventsSelectionContainer, styles?.eventsSelectionContainer]}
      >
        <Dropdown
          items={myEvents}
          onSelectItem={onChangeEvent}
          selectedOption={selectedEvent}
          styles={dropdownStyles}
          isDisabled={isLoading || isRefreshing}
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

  const timeFilterDropdown = (
    <View style={[s.eventsContainer, styles?.timeFilters?.container]}>
      <View
        style={[
          s.eventsSelectionContainer,
          styles?.timeFilters?.selectionContainer,
        ]}
      >
        <Dropdown
          items={timeFilters}
          onSelectItem={onChangeTimeFilter}
          selectedOption={selectedTimeFilter}
          styles={dropdownStyles}
        />
        <TouchableOpacity onPress={onClearSelectedTimeFilter}>
          <Image
            source={R.icons.error}
            style={[
              s.clearEventSelectionIcon,
              styles?.timeFilters?.clearSelectionIcon,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
  //#endregion Renders

  const renderEmptyOrders = () => (
    <View style={styles?.emptyOrders?.container}>
      <Text style={styles?.emptyOrders?.message}>
        {texts?.emptyOrdersMessage ||
          'No orders were found for the selected filters'}
      </Text>
    </View>
  )

  //#region Return
  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <SafeAreaView style={[s.safeArea, styles?.safeArea]}>
        <Text style={[s.eventsTitle, styles?.eventsTitle]}>
          {texts?.title || 'Events'}
        </Text>
        {!config?.isTimeFilterDropdownHidden && timeFilterDropdown}
        {!config?.isEventsDropdownHidden &&
          myEvents?.length > 0 &&
          eventsDropdown}
        <View style={[s.listContainer, styles?.listContainer]}>
          {myOrders?.length > 0 ? (
            <FlatList
              data={myOrders}
              renderItem={renderOrderListItem}
              refreshControl={renderRefreshControl}
              onEndReached={handleOnReachEnd}
              onMomentumScrollBegin={handleOnMomentumScrollBegin}
              onEndReachedThreshold={0.2}
              extraData={myOrders}
            />
          ) : (
            !isLoading && renderEmptyOrders()
          )}
          {isLoading && myOrders.length > 8 && !isRefreshing && (
            <ActivityIndicator
              size={'large'}
              color={styles?.refreshControlColor || R.colors.primary}
            />
          )}
        </View>
        {config?.areActivityIndicatorsEnabled && isGettingEventDetails && (
          <Loading />
        )}
      </SafeAreaView>
    </View>
  )
  //#endregion Return
}

export default MyOrdersView
