import InputPhone from '@sesamsolutions/phone-input'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Platform, View } from 'react-native'

import R from '../../res'
import Input from '../input/Input'
import s from './/styles'
import { IOnChangePhoneNumberPayload, IPhoneInputProps } from './types'

const PhoneInput: FC<IPhoneInputProps> = ({
  phoneNumber,
  onChangePhoneNumber,
  styles,
  error,
  texts,
  country = 'US',
}) => {
  const [localValue, setLocalValue] = useState('')
  const setLocalValueCallback = useCallback(() => {
    setLocalValue(phoneNumber)
  }, [phoneNumber])

  useEffect(() => {
    setLocalValueCallback()
  }, [phoneNumber, setLocalValueCallback])

  const handleOnChangeInputPhone = (payload: IOnChangePhoneNumberPayload) => {
    setLocalValue(payload.input)
    onChangePhoneNumber(payload)
  }

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <Input
        onChangeText={setLocalValue}
        label={texts?.label || 'Phone number'}
        keyboardType='phone-pad'
        error={error}
        value={localValue}
        labelOffset={{
          x1: Platform.OS === 'ios' ? -40 : -40,
        }}
        styles={{
          container: s.phoneInputContainer,
          ...styles?.input,
          errorColor: styles?.errorColor || R.colors.danger,
        }}
        renderLeftAccessory={() => (
          <View style={(s.countryContainer, styles?.country?.container)}>
            <InputPhone
              initialCountry={country}
              onChange={handleOnChangeInputPhone}
              style={s.countryButton}
              textStyle={s.textInput}
              value={localValue}
            />
          </View>
        )}
      />
    </View>
  )
}

export default PhoneInput
