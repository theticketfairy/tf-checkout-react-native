//@ts-nocheck

import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import R from '../../res'
import DropdownListItem from '../dropdown/DropdownListItem'
import Input from '../input/Input'
import Separator from '../separator/Separator'
import { DropdownMaterialStyles as s } from './styles'
import { IDropdownItem, IDropdownMaterialProps } from './types'

const DropdownMaterial = ({
  items,
  selectedOption,
  onSelectItem,
  styles,
  materialInputProps,
}: IDropdownMaterialProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const flatListRef: MutableRefObject<FlatList> = useRef()

  const showModal = () => {
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
    (data, index) => ({
      length: 45,
      offset: 45 * index,
      index,
    }),
    []
  )

  const RightComponent = useCallback(
    () => <Image source={R.icons.dropdown} style={[s.icon, styles?.icon]} />,
    [styles?.icon]
  )

  return (
    <View style={[s.rootContainer, styles?.container]}>
      <TouchableOpacity onPress={showModal} style={s.button}>
        <Input
          {...materialInputProps}
          value={selectedOption?.label}
          styles={styles?.input}
          disabled={true}
          pointerEvents='box-none'
          disabledLineWidth={1}
          renderRightAccessory={RightComponent}
        />
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

export default DropdownMaterial
