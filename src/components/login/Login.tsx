import React, { FC, useRef, useState } from 'react'
import { Keyboard } from 'react-native'

import { LoginCore, LoginCoreHandle } from '../../core'
import { IUserProfilePublic } from '../../types'
import LoginView from './LoginView'
import { ILoginFields, ILoginProps } from './types'

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
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [userProfileData, setUserProfileData] = useState<IUserProfilePublic>()

  const loginCoreRef = useRef<LoginCoreHandle>(null)

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

  return (
    <LoginCore ref={loginCoreRef}>
      <LoginView
        showDialog={showLoginDialog}
        hideDialog={hideLoginDialog}
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
      />
    </LoginCore>
  )
}

export default Login
