import React, { FC } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
//@ts-ignore
import { CountryPicker } from 'react-native-country-codes-picker'

import Input from '../input/Input'
import s from './/styles'
import { IPhoneCountry, IPhoneInputProps } from './types'

const PhoneInput: FC<IPhoneInputProps> = ({
  isPickerVisible,
  onSelectCountry,
  onChangePickerVisibility,
  country,
  styles,
  error,
  texts,
  onChangePhoneNumber,
}) => {
  const flag = country ? `${country.flag}` : '🇦🇫'
  const countryCode = country ? `${country.dial_code}` : '+93'

  const showModal = () => {
    onChangePickerVisibility(true)
  }

  const hideModal = () => {
    onChangePickerVisibility(false)
  }

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <View style={[s.countryContainer, styles?.country?.container]}>
        <TouchableOpacity
          style={[s.countryButton, styles?.country?.button]}
          onPress={showModal}
        >
          <Text style={styles?.country?.flag}>
            {flag} <Text style={styles?.country?.code}>{countryCode}</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Input
        onChangeText={onChangePhoneNumber}
        label={texts?.label || 'Phone number'}
        keyboardType='phone-pad'
        error={error}
        styles={{
          container: s.phoneInputContainer,
          ...styles?.input,
        }}
      />
      <Modal
        presentationStyle='overFullScreen'
        transparent={true}
        visible={isPickerVisible}
      >
        <View style={s.modalBackground}>
          <CountryPicker
            show={isPickerVisible}
            // when picker button press you will get the country object with dial code
            inputPlaceholder={
              texts?.countrySearchPlaceholder || 'Search country'
            }
            pickerButtonOnPress={(item: IPhoneCountry) => onSelectCountry(item)}
            style={styles?.modal}
            onBackdropPress={hideModal}
            disableBackdrop={false}
          />
        </View>
      </Modal>
    </View>
  )
}

export default PhoneInput
