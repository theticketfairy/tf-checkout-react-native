import React, { useEffect, useState } from 'react'
import { Alert, Keyboard } from 'react-native'

import {
  authorize,
  fetchAccessToken,
  fetchUserProfile,
  setAccessTokenHandler,
} from '../../api/ApiClient'
import Constants from '../../api/Constants'
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
  message,
  userProfileProp,
  onLogoutSuccess,
  texts,
  styles,
}: ILoginProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userProfileData, setUserProfileData] = useState<IUserProfile>()

  const handleOnPressLogin = async (email: string, password: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append('email', email)
    bodyFormData.append('password', password)

    setIsLoading(true)
    const { code, error } = await authorize(bodyFormData)
    if (error || !code) {
      setIsLoading(false)
      return Alert.alert('', error)
    }

    const bodyFormDataToken = new FormData()
    bodyFormDataToken.append('code', code)
    bodyFormDataToken.append('scope', 'profile')
    bodyFormDataToken.append('grant_type', 'authorization_code')
    bodyFormDataToken.append(
      'client_id',
      Constants.CLIENT_ID || 'e9d8f8922797b4621e562255afe90dbf'
    )
    bodyFormDataToken.append(
      'client_secret',
      Constants.CLIENT_SECRET ||
        'b89c191eff22fdcf84ac9bfd88d005355a151ec2c83b26b9'
    )

    const { error: tokenError, accessToken } = await fetchAccessToken(
      bodyFormDataToken
    )

    if (tokenError) {
      setIsLoading(false)
      return Alert.alert('', tokenError)
    }

    setAccessTokenHandler(accessToken)

    const { error: userProfileError, userProfile } = await fetchUserProfile(
      accessToken
    )

    if (userProfileError || !userProfile) {
      setIsLoading(false)
      return Alert.alert('', userProfileError)
    }

    const storedUserData: IStoredUserData = {
      id: userProfile.id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
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

  useEffect(() => {
    if (!userProfileData && userProfileProp) {
      setUserProfileData(userProfileProp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileProp])

  return (
    <LoginView
      showDialog={showLoginDialog}
      hideDialog={hideLoginDialog}
      isDialogVisible={isLoginDialogVisible}
      onPressLogin={handleOnPressLogin}
      isLoading={isLoading}
      userProfile={userProfileData}
      message={message}
      onPressLogout={handleOnPressLogout}
      texts={texts}
      styles={styles}
    />
  )
}

export default Login
