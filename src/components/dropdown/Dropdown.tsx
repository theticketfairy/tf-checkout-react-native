//@ts-nocheck
import React, {
  type MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import R from '../../res'
import Separator from '../separator/Separator'
import DropdownListItem from './DropdownListItem'
import { DropdownStyles as s } from './styles'
import type { IDropdownItem, IDropdownProps } from './types'



const Dropdown = ({
  items,
  selectedOption,
  onSelectItem,
  styles,
  isDisabled,
}: IDropdownProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const flatListRef: MutableRefObject<FlatList> = useRef()

  const showModal = () => {
    if (isDisabled) {
      return
    }

    requestAnimationFrame(() => {
      setIsModalVisible(true)
    })
  }
  const hideModal = () => {
    requestAnimationFrame(() => {
      setIsModalVisible(false)
    })
  }

  const handleOnSelectItem = (item: IDropdownItem) => {
    onSelectItem(item)
    hideModal()
  }

  useEffect(() => {
    if (flatListRef?.current) {
      flatListRef.current.flashScrollIndicators()
    }
  }, [isModalVisible])

  const renderItem = useCallback(
    ({ item }) => (
      <DropdownListItem
        item={item}
        onSelectItem={handleOnSelectItem}
        selectedOption={selectedOption}
        styles={styles?.listItem}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleOnSelectItem, selectedOption]
  )

  const keyExtractor = useCallback(
    (item: IDropdownItem) => item.value.toString(),
    []
  )

  const renderSeparator = useCallback(() => <Separator />, [])

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: 45,
      offset: 45 * index,
      index,
    }),
    []
  )

  return (
    <View style={[s.rootContainer, styles?.container]}>
      <TouchableOpacity onPress={showModal} style={[s.button, styles?.button]}>
        <Text style={[s.label, styles?.label]}>{selectedOption?.label}</Text>
        <Image source={R.icons.dropdown} style={[s.icon, styles?.icon]} />
      </TouchableOpacity>
      {isModalVisible && items.length > 0 && (
        <Modal presentationStyle='overFullScreen' transparent={true}>
          <View style={s.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={hideModal}
              style={s.modalBackgroundTouchable}
            >
              <TouchableWithoutFeedback>
                <View style={[s.dialog, styles?.dialog]}>
                  <FlatList
                    keyExtractor={keyExtractor}
                    ref={flatListRef}
                    indicatorStyle='black'
                    data={items}
                    extraData={items}
                    maxToRenderPerBatch={6}
                    initialNumToRender={6}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderSeparator}
                    getItemLayout={getItemLayout}
                    style={[s.flatListContainer, styles?.flatListContainer]}
                  />
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default Dropdown
