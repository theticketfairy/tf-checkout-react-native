import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
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
import Input from '../input/Input'
import Separator from '../separator/Separator'
import DropdownListItem from './DropdownListItem'
import { DropdownStyles as s } from './styles'
import { IDropdownItem, IDropdownProps } from './types'

const Dropdown = ({
  items,
  selectedOption,
  onSelectItem,
  styles,
  label,
  isMaterial,
}: IDropdownProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const flatListRef: MutableRefObject<FlatList> = useRef()

  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const handleOnSelectItem = (item: IDropdownItem) => {
    onSelectItem(item)
    setTimeout(() => {
      hideModal()
    }, 300)
  }

  const onButtonPress = () => {
    console.log('DROPDOWN - onButtonPress')
    requestAnimationFrame(() => showModal())
  }

  useEffect(() => {
    if (flatListRef?.current) {
      flatListRef.current.flashScrollIndicators()
    }
  }, [isModalVisible])

  return (
    <View style={[s.rootContainer, styles?.container]}>
      <TouchableOpacity
        onPress={onButtonPress}
        style={[s.button, styles?.button]}
      >
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
                <View style={s.dialog}>
                  <FlatList
                    ref={flatListRef}
                    indicatorStyle='black'
                    data={items}
                    extraData={items}
                    renderItem={({ item }) => (
                      <DropdownListItem
                        item={item}
                        onSelectItem={handleOnSelectItem}
                        selectedOption={selectedOption}
                      />
                    )}
                    ItemSeparatorComponent={() => <Separator />}
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
