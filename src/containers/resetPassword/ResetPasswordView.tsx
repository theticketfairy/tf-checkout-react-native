import React, { FC } from 'react'
import { Keyboard, Pressable, Text, View } from 'react-native'

import { Button, Input } from '../../components'
import s from './styles'
import type { IResetPasswordViewProps } from './types'

const ResetPasswordView: FC<IResetPasswordViewProps> = ({
  styles,
  texts,
  isLoading,
  onPressCancelButton,
  onPressResetButton,
  apiError,
  password,
  passwordConfirm,
  onChangePassword,
  onChangePasswordConfirm,
  passwordConfirmError,
  passwordError,
  isDataValid,
  apiSuccess,
}) => (
  <Pressable style={s.pressable} onPress={Keyboard.dismiss}>
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <View style={[s.contentContainer, styles?.contentContainer]}>
        <Text style={[s.dialogTitle, styles?.title]}>
          {texts?.title || 'Enter your new password'}
        </Text>

        <Input
          onChangeText={onChangePassword}
          styles={styles?.input}
          label={texts?.newPasswordLabel || 'New password'}
          error={passwordError}
          value={password}
          autoCapitalize='none'
          secureTextEntry={true}
          isShowPasswordButtonVisible={true}
        />

        <Input
          onChangeText={onChangePasswordConfirm}
          styles={styles?.input}
          label={texts?.confirmNewPasswordLabel || 'Confirm new password'}
          error={passwordConfirmError}
          value={passwordConfirm}
          autoCapitalize='none'
          secureTextEntry={true}
          isShowPasswordButtonVisible={true}
        />

        {!!apiError && (
          <Text style={[s.apiError, styles?.apiError]}>{apiError}</Text>
        )}

        {apiSuccess ? (
          <Text style={styles?.apiSuccess}>{apiSuccess}</Text>
        ) : (
          <Button
            text={texts?.resetButton || 'RESET PASSWORD'}
            onPress={onPressResetButton}
            isLoading={isLoading}
            isDisabled={!isDataValid || isLoading}
            styles={{
              container: [
                s.resetButtonContainer,
                styles?.resetButton?.container,
              ],
              ...styles?.resetButton,
            }}
          />
        )}

        <Button
          text={texts?.cancelButton || 'CANCEL'}
          onPress={onPressCancelButton}
          isDisabled={isLoading}
          styles={styles?.cancelButton}
        />
      </View>
    </View>
  </Pressable>
)

export default ResetPasswordView
