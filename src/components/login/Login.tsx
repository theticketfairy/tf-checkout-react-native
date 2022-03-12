import React, { useState } from 'react'
import { Keyboard } from 'react-native'

import {
  authorize,
  fetchAccessToken,
  fetchUserProfile,
  setAccessTokenHandler,
} from '../../api/ApiClient'
import { Config } from '../../helpers/Config'
import {
  deleteAllData,
  IStoredUserData,
  LocalStorageKeys,
  storeData,
} from '../../helpers/LocalStorage'
import { IUserProfile } from '../../types'
import LoginView from './LoginView'
import { ILoginProps } from './types'

const Login = ({
  onLoginSuccessful,
  isLoginDialogVisible,
  showLoginDialog,
  hideLoginDialog,
  userFirstName,
  onLogoutSuccess,
  texts,
  styles,
  onLoginError,
  onFetchAccessTokenError,
  onFetchUserProfileError,
  refs,
  brandImages,
  onFetchAccessTokenSuccess,
  onFetchUserProfileSuccess,
}: ILoginProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [userProfileData, setUserProfileData] = useState<IUserProfile>()

  const handleOnPressLogin = async (email: string, password: string) => {
    if (loginError) {
      setLoginError('')
    }
    const bodyFormData = new FormData()
    bodyFormData.append('email', email)
    bodyFormData.append('password', password)

    setIsLoading(true)
    const { code, error } = await authorize(bodyFormData)
    if (error || !code) {
      setIsLoading(false)
      if (onLoginError) {
        setLoginError(error?.message || 'Auth error')
        return onLoginError(error!)
      }
    }

    const bodyFormDataToken = new FormData()
    bodyFormDataToken.append('code', code)
    bodyFormDataToken.append('scope', 'profile')
    bodyFormDataToken.append('grant_type', 'authorization_code')
    bodyFormDataToken.append('client_id', Config.CLIENT_ID)
    bodyFormDataToken.append('client_secret', Config.CLIENT_SECRET)

    const { error: tokenError, accessToken } = await fetchAccessToken(
      bodyFormDataToken
    )

    if (tokenError) {
      setIsLoading(false)
      if (onFetchAccessTokenError) {
        return onFetchAccessTokenError(tokenError)
      }
    }

    if (onFetchAccessTokenError) {
      setAccessTokenHandler(accessToken)
    }

    if (onFetchAccessTokenSuccess) {
      onFetchAccessTokenSuccess()
    }

    const { error: userProfileError, userProfile } = await fetchUserProfile(
      accessToken
    )

    if (userProfileError || !userProfile) {
      setIsLoading(false)
      if (onFetchUserProfileError) {
        return onFetchUserProfileError(userProfileError!)
      }
      return
    }

    if (onFetchUserProfileSuccess) {
      onFetchUserProfileSuccess({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      })
    }

    const storedUserData: IStoredUserData = {
      id: userProfile!.id,
      firstName: userProfile!.firstName,
      lastName: userProfile!.lastName,
      email: userProfile!.email,
    }

    await storeData(LocalStorageKeys.USER_DATA, JSON.stringify(storedUserData))
    await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)

    Keyboard.dismiss()
    setUserProfileData(userProfile)
    onLoginSuccessful(userProfile!, accessToken)
    setIsLoading(false)
    hideLoginDialog()
  }

  const handleOnPressLogout = async () => {
    await deleteAllData()
    setUserProfileData(undefined)
    if (onLogoutSuccess) {
      onLogoutSuccess()
    }
  }

  return (
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
  )
}

export default Login
