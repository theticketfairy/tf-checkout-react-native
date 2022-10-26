import React, { FC, useRef, useState } from 'react'
import { Alert, Keyboard } from 'react-native'

import { IResetPasswordRequestData } from '../../api/types'
import { LoginCore, LoginCoreHandle } from '../../core'
import { IUserProfilePublic } from '../../types'
import { IResetPasswordButtonPayload } from '../restorePassword/types'
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
  onResetPasswordError,
  onResetPasswordSuccess,
}) => {
  //#region State
  const [isLoading, setIsLoading] = useState(false)
  const [loginApiError, setLoginApiError] = useState('')
  const [restorePasswordApiError, setRestorePasswordApiError] = useState('')
  const [restorePasswordSuccessMessage, setRestorePasswordSuccessMessage] =
    useState('')
  const [resetPasswordApiError, setResetPasswordApiError] = useState('')
  const [userProfileData, setUserProfileData] = useState<IUserProfilePublic>()
  const [loginContentType, setLoginContentType] =
    useState<LoginContentType>('login')
  const [isRestorePasswordLoading, setIsRestorePasswordLoading] =
    useState(false)
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false)
  //#endregion State

  const loginCoreRef = useRef<LoginCoreHandle>(null)
  const resetPasswordToken = useRef<string>(null)

  //#region Handlers
  const handleOnPressForgotPassword = () =>
    setLoginContentType('restorePassword')

  const handleOnPressLogin = async (fields: ILoginFields) => {
    if (loginApiError) {
      setLoginApiError('')
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
      setLoginApiError(authorizationError?.message || 'Auth error')
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

  const handleOnPressCancelRestorePasswordButton = () =>
    setLoginContentType('login')

  const handleOnPressRestorePasswordButton = async (email: string) => {
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
      setRestorePasswordApiError(
        restorePassError?.message || 'Restore password unknown error'
      )
      setIsRestorePasswordLoading(false)
      onRestorePasswordError?.(restorePassError!)
      return
    }

    setLoginContentType('restorePasswordSuccess')

    setRestorePasswordSuccessMessage(restorePasswordSuccessData.message)
    onRestorePasswordSuccess?.()
  }

  const handleOnPressResetPasswordButton = async (
    data: IResetPasswordButtonPayload
  ) => {
    if (!loginCoreRef.current?.resetPassword) {
      return onResetPasswordError?.({
        message: 'LoginCoreRef is not initialized',
      })
    }

    if (!resetPasswordToken.current) {
      return onResetPasswordError?.({
        message: 'Token not found, please request password restoration again.',
      })
    }

    setIsResetPasswordLoading(true)

    const res = await loginCoreRef.current.resetPassword({
      ...data,
      token: resetPasswordToken.current!,
    })
    setIsResetPasswordLoading(false)
  }

  const handleOnPressCancelResetPasswordButton = () => {
    setLoginContentType('login')
  }

  const handleOnPressRestorePasswordSuccessButton = () => {
    handleHideDialog()
  }

  const handleHideDialog = () => {
    setLoginContentType('login')
    hideLoginDialog()
  }
  //#endregion

  //#region Render Main Content
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
        loginApiError={loginApiError}
        refs={refs}
        brandImages={brandImages}
        isShowPasswordButtonVisible={isShowPasswordButtonVisible}
        content={loginContentType}
        onPressForgotPassword={handleOnPressForgotPassword}
        restorePasswordProps={{
          apiError: restorePasswordApiError,
          onPressRestorePasswordButton: handleOnPressRestorePasswordButton,
          isLoading: isRestorePasswordLoading,
          onPressCancelButton: handleOnPressCancelRestorePasswordButton,
        }}
        resetPasswordProps={{
          apiError: resetPasswordApiError,
          isLoading: isResetPasswordLoading,
          onPressResetButton: handleOnPressResetPasswordButton,
          onPressCancelButton: handleOnPressCancelResetPasswordButton,
        }}
        resultDialogPropsProps={{
          message: restorePasswordSuccessMessage,
          onPressButton: handleOnPressRestorePasswordSuccessButton,
        }}
      />
    </LoginCore>
  )
  //#endregion Render Main Content
}

export default Login
