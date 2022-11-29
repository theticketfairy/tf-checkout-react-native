import React, { FC } from 'react'
import { Text, View } from 'react-native'

import Button from '../../button/Button'
import Input from '../../input/Input'
import s from '../styles'
import { ILoginFormProps } from './types'

const LoginForm: FC<ILoginFormProps> = ({
  viewProps,
  email,
  emailError,
  onEmailChanged,
  password,
  passwordError,
  onPasswordChanged,
  loginApiError,
  isShowPasswordButtonVisible,
  onPressForgotPassword,
  isLoginButtonDisabled,
  isLoading,
  onPressLoginButton,
  brandImages,
}) => {
  const { styles, texts } = viewProps || {}

  return (
    <View style={[s.dialog, styles?.dialog?.container]}>
      <Text style={[s.dialogTitle, styles?.dialog?.title]}>
        {texts?.dialog?.title || 'Login'}
      </Text>

      {brandImages}

      {!!texts?.dialog?.message && (
        <Text style={[s.message, styles?.dialog?.message]}>
          {texts.dialog.message}
        </Text>
      )}

      <Input
        label={texts?.dialog?.emailLabel || 'Email'}
        error={emailError}
        keyboardType='email-address'
        value={email}
        onChangeText={onEmailChanged}
        autoCapitalize='none'
      />
      <Input
        label={texts?.dialog?.passwordLabel || 'Password'}
        error={passwordError}
        keyboardType='default'
        value={password}
        onChangeText={onPasswordChanged}
        autoCapitalize='none'
        secureTextEntry={true}
        isShowPasswordButtonVisible={isShowPasswordButtonVisible}
      />

      {!!loginApiError && <Text style={[s.error]}>{loginApiError}</Text>}

      <Text
        onPress={onPressForgotPassword}
        style={[s.forgotPassword, styles?.dialog?.forgotPassword]}
      >
        {texts?.dialog?.forgotPassword || 'Forgot Password'}
      </Text>

      <Button
        styles={
          isLoginButtonDisabled
            ? {
                container: [s.loginButton],
                ...styles?.dialog?.loginButtonDisabled,
              }
            : {
                container: [s.loginButton],
                ...styles?.dialog?.loginButton,
              }
        }
        text={texts?.dialog?.loginButton || 'LOGIN'}
        onPress={onPressLoginButton}
        isLoading={isLoading}
        isDisabled={isLoginButtonDisabled}
      />
    </View>
  )
}

export default LoginForm
