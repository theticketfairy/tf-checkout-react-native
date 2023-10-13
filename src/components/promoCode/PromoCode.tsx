import React, { type FC, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

import R from '../../res'
import Button from '../button/Button'
import s from './styles'
import type { IPromoCodeProps } from './types'



const PromoCode: FC<IPromoCodeProps> = ({
  onPressApply,
  promoCodeValidationMessage,
  isPromoCodeValid,
  styles,
  texts,
  isAccessCodeEnabled,
  closeButtonIcon,
}) => {
  const [isActive, setIsActive] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  const activate = () => setIsActive(true)
  const deactivate = (): string => {
    const code = promoCode
    setIsActive(false)
    setPromoCode('')
    return code
  }

  const handleOnPressPromoCode = () => {
    activate()
  }

  const handleOnPressApply = () => {
    onPressApply(promoCode)
  }

  const isCodeValid = () => {
    if (typeof isPromoCodeValid === 'boolean') {
      return isPromoCodeValid
    } else if (typeof isPromoCodeValid === 'number') {
      return isPromoCodeValid > 0
    }
    return false
  }

  const isApplyButtonDisabled = promoCode.length === 0
  const submitButton = texts?.apply
    ? texts.apply
    : isAccessCodeEnabled
    ? 'ENTER'
    : 'APPLY'

  const resultMessageValidStyle = [s.validMessage, styles?.validMessage]
  const resultMessageErrorStyle = [s.errorMessage, styles?.errorMessage]
  const resultMessageStyle = isCodeValid()
    ? resultMessageValidStyle
    : resultMessageErrorStyle
  const resultMessage = isCodeValid()
    ? texts?.validMessage || 'Valid promo code'
    : texts?.errorMessage || promoCodeValidationMessage

  return (
    <View style={[{}, styles?.rootContainer]}>
      {isActive || isAccessCodeEnabled ? (
        <View style={styles?.contentWrapper}>
          <View style={[s.content, styles?.content]}>
            <TextInput
              placeholder={texts?.inputPlaceHolder || 'Enter promo code'}
              placeholderTextColor={
                styles?.inputPlaceholderColor || R.colors.disabled
              }
              value={promoCode}
              style={[s.input, styles?.input]}
              onChangeText={(text) => setPromoCode(text)}
              autoCapitalize='none'
              underlineColorAndroid={R.colors.transparent}
            />

            <TouchableOpacity
              style={[s.cancelButton, styles?.cancelButton]}
              onPress={deactivate}
            >
              <Image
                source={closeButtonIcon || R.icons.error}
                style={[s.cancelIcon, styles?.cancelIcon]}
              />
            </TouchableOpacity>
            <Button
              text={texts?.apply || submitButton}
              styles={
                isApplyButtonDisabled
                  ? styles?.applyDisabledButton
                  : styles?.applyButton
              }
              onPress={handleOnPressApply}
              isDisabled={isApplyButtonDisabled}
            />
          </View>
          {!!resultMessage && (
            <Text style={resultMessageStyle}>{resultMessage}</Text>
          )}
        </View>
      ) : (
        <Button
          text={texts?.mainButton || 'Got a promo code? Click here'}
          onPress={handleOnPressPromoCode}
          styles={{
            text: [s.mainButtonText, styles?.mainButton?.text],
            container: [s.mainButtonContainer, styles?.mainButton?.container],
            button: styles?.mainButton?.button,
          }}
        />
      )}
    </View>
  )
}

export default PromoCode
