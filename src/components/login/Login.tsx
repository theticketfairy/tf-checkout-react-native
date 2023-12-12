import React, { FC, useRef, useState } from 'react'
import { Keyboard } from 'react-native'

import { LoginCore, LoginCoreHandle } from '../../core'
import type { IUserProfilePublic } from '../../types'
import LoginView from './LoginView'
import type { ILoginFields, ILoginProps, LoginContentType } from './types'

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
  isShowPasswordButtonVisible,
  onRestorePasswordError,
  onRestorePasswordSuccess,
}) => {
  //#region State
  const [isLoading, setIsLoading] = useState(false)
  const [loginApiError, setLoginApiError] = useState('')
  const [restorePasswordApiError, setRestorePasswordApiError] = useState('')
  const [
    restorePasswordSuccessMessage,
    setRestorePasswordSuccessMessage,
  ] = useState('')
  const [userProfileData, setUserProfileData] = useState<IUserProfilePublic>()
  const [loginContentType, setLoginContentType] = useState<LoginContentType>(
    'login'
  )
  const [isRestorePasswordLoading, setIsRestorePasswordLoading] = useState(
    false
  )
  //#endregion State

  const loginCoreRef = useRef<LoginCoreHandle>(null)

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
    const {
      userProfile,
      error: authorizationError,
      accessTokenData,
    } = await loginCoreRef.current.login(fields)

    if (authorizationError || !userProfile) {
      setIsLoading(false)
      setLoginApiError(authorizationError?.message || 'Auth error')
      return onLoginError?.(authorizationError!)
    }

    Keyboard.dismiss()
    setUserProfileData(userProfile)
    onLoginSuccessful({
      userProfile,
      accessTokenData,
    })
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
    const {
      data: restorePasswordSuccessData,
      error: restorePassError,
    } = await loginCoreRef.current.restorePassword(email)
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
