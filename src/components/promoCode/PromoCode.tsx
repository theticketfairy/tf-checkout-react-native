import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'

import R from '../../res'
import Button from '../button/Button'
import { IButtonStyles } from '../button/types'
import s from './styles'
import { IPromoCodeProps } from './types'

const PromoCode = ({
  onPressApply,
  promoCodeValidationMessage,
  isPromoCodeValid,
  styles,
  texts,
  isAccessCodeEnabled,
}: IPromoCodeProps) => {
  const [isActive, setIsActive] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  const activate = () => setIsActive(true)
  const deactivate = () => setIsActive(false)

  const handleOnPressPromoCode = () => {
    activate()
  }

  const handleOnPressApply = () => {
    deactivate()
    onPressApply(promoCode)
    setTimeout(() => {
      setPromoCode('')
    }, 300)
  }

  const applyButtonDisabledStyles: IButtonStyles = {
    container: styles?.applyDisabledButton?.container,
    text: [s.applyText, styles?.applyDisabledButton?.text],
    button: [s.applyButtonDisabled, styles?.applyDisabledButton?.button],
  }

  const applyButtonStyles: IButtonStyles = {
    container: styles?.applyButton?.container,
    text: [s.applyText, styles?.applyButton?.text],
    button: [s.applyButton, styles?.applyButton?.button],
  }

  const isCodeValid = () => {
    if (typeof isPromoCodeValid === 'boolean') {
      return isPromoCodeValid
    } else if (typeof isPromoCodeValid === 'number') {
      return isPromoCodeValid > 0
    }
  }

  const successComponent = () =>
    isCodeValid() && (
      <View style={[s.messageContainer, styles?.messageContainer]}>
        <Text style={styles?.message}>
          {promoCodeValidationMessage ||
            'Your promo code was applied successfully.'}
        </Text>
      </View>
    )

  const isApplyButtonDisabled = promoCode.length === 0
  const inputPlaceHolder = texts?.title
    ? texts.title
    : isAccessCodeEnabled
    ? 'Enter your access code'
    : 'Promo Code'
  const submitButton = texts?.apply
    ? texts.apply
    : isAccessCodeEnabled
    ? 'ENTER'
    : 'APPLY'

  return (
    <View style={styles?.rootContainer}>
      {successComponent()}

      {isActive || isAccessCodeEnabled ? (
        <View style={[s.contentWrapper, styles?.contentWrapper]}>
          <Text style={[s.title, styles?.title]}>{inputPlaceHolder}</Text>
          <View style={[s.content, styles?.content]}>
            <TextInput
              placeholder={texts?.inputPlaceHolder || inputPlaceHolder}
              placeholderTextColor={
                styles?.inputPlaceholderColor || R.colors.disabled
              }
              value={promoCode}
              style={[s.input, styles?.input]}
              onChangeText={(text) => setPromoCode(text)}
              autoCapitalize='none'
            />
            <Button
              text={texts?.apply || submitButton}
              styles={
                isApplyButtonDisabled
                  ? applyButtonDisabledStyles
                  : applyButtonStyles
              }
              onPress={handleOnPressApply}
              isDisabled={isApplyButtonDisabled}
            />
            <Button
              text={texts?.cancel || 'Cancel'}
              styles={{
                container: styles?.cancelButton?.container,
                text: [s.cancelText, styles?.cancelButton?.text],
                button: [s.cancelButton, styles?.cancelButton?.button],
              }}
              onPress={deactivate}
            />
          </View>
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
