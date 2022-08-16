import React, { FC, useRef, useState } from 'react'
import { Alert, Keyboard } from 'react-native'

import { LoginCore, LoginCoreHandle } from '../../core'
import { IUserProfilePublic } from '../../types'
import LoginView from './LoginView'
import { ILoginFields, ILoginProps, LoginContentType } from './types'

const Login: FC<ILoginProps> = ({
  onLoginSuccessful,
  onLoginError,
  isLoginDialogVisible,
  showLoginDialog,
  hideLoginDialog,
  userFirstName,
  onLogoutSuccess,
  onLogoutError,
  texts,
  styles,
  refs,
  brandImages,
  config,
  isShowPasswordButtonVisible,
  onRestorePasswordError,
  onRestorePasswordSuccess,
  forgotPasswordViewProps,
  restorePasswordViewProps,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [restorePasswordError, setRestorePasswordError] = useState('')
  const [restorePasswordSuccessMessage, setRestorePasswordSuccessMessage] =
    useState('')
  const [resetPasswordError, setResetPasswordError] = useState('')
  const [userProfileData, setUserProfileData] = useState<IUserProfilePublic>()
  const [loginContentType, setLoginContentType] =
    useState<LoginContentType>('login')
  const [isRestorePasswordLoading, setIsRestorePasswordLoading] =
    useState(false)

  const loginCoreRef = useRef<LoginCoreHandle>(null)

  //#region Handlers
  const handleOnPressForgotPassword = () =>
    setLoginContentType('restorePassword')

  const handleOnPressLogin = async (fields: ILoginFields) => {
    if (loginError) {
      setLoginError('')
    }

    if (!loginCoreRef.current?.login) {
      return onLoginError?.({
        message: 'LoginCoreRef is not initialized',
      })
    }

    setIsLoading(true)
    const { data: authorizationData, error: authorizationError } =
      await loginCoreRef.current.login(fields)

    if (authorizationError || !authorizationData) {
      setIsLoading(false)
      setLoginError(authorizationError?.message || 'Auth error')
      return onLoginError?.(authorizationError!)
    }

    Keyboard.dismiss()
    setUserProfileData(authorizationData)
    onLoginSuccessful(authorizationData)
    setIsLoading(false)
    hideLoginDialog()
  }

  const handleOnPressLogout = async () => {
    if (!loginCoreRef.current?.logout) {
      return onLogoutError?.({ message: 'LoginCoreRef is not initialized' })
    }

    await loginCoreRef.current.logout()

    setUserProfileData(undefined)
    onLogoutSuccess?.()
  }

  const handleOnPressRestorePassword = async (email: string) => {
    if (!loginCoreRef.current?.restorePassword) {
      return onRestorePasswordError?.({
        message: 'LoginCoreRef is not initialized',
      })
    }

    setIsRestorePasswordLoading(true)
    const { data: restorePasswordSuccessData, error: restorePassError } =
      await loginCoreRef.current.restorePassword(email)
    setIsRestorePasswordLoading(false)

    if (restorePassError || !restorePasswordSuccessData) {
      setRestorePasswordError(
        restorePassError?.message || 'Restore password unknown error'
      )
      setIsRestorePasswordLoading(false)
      if (config?.areAlertsEnabled) {
        Alert.alert('', restorePasswordError)
      }
      onRestorePasswordError?.(restorePassError!)
      return
    }

    setLoginContentType('restorePasswordSuccess')
    setRestorePasswordSuccessMessage(restorePasswordSuccessData.message)
    onRestorePasswordSuccess?.()
  }

  const handleHideDialog = () => {
    setLoginContentType('login')
    hideLoginDialog()
  }
  //#endregion

  return (
    <LoginCore ref={loginCoreRef}>
      <LoginView
        showDialog={showLoginDialog}
        hideDialog={handleHideDialog}
        isDialogVisible={isLoginDialogVisible}
        onPressLogin={handleOnPressLogin}
        isLoading={isLoading}
        userProfile={userProfileData}
        onPressLogout={handleOnPressLogout}
        texts={texts}
        styles={styles}
        userFirstName={userFirstName}
        loginError={loginError}
        refs={refs}
        brandImages={brandImages}
        isShowPasswordButtonVisible={isShowPasswordButtonVisible}
        content={loginContentType}
        onPressForgotPassword={handleOnPressForgotPassword}
        restorePasswordProps={{
          restorePasswordError: restorePasswordError,
          onPressRestorePassword: handleOnPressRestorePassword,
          restorePasswordViewProps: forgotPasswordViewProps,
          isRestorePasswordLoading: isRestorePasswordLoading,
        }}
        restorePasswordSuccessProps={{
          restorePasswordSuccessMessage: restorePasswordSuccessMessage,
          restorePasswordSuccessViewProps: restorePasswordViewProps,
        }}
        resetPasswordProps={{
          onPressResetPassword: function (
            data: IResetPasswordRequestData
          ): void {
            throw new Error('Function not implemented.')
          },
          resetPasswordError: undefined,
          isResetPasswordLoading: undefined,
        }}
      />
    </LoginCore>
  )
}

export default Login
