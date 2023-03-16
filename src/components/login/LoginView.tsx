import React, { FC, useMemo, useState } from 'react'
import { Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native'

import { useDebounced } from '../../helpers/Debounced'
import { validateEmail, validateMinLength } from '../../helpers/Validators'
import R from '../../res'
import Button from '../button/Button'
import RestorePassword from '../restorePassword/RestorePassword'
import ResultDialog from '../restorePassword/ResultDialog'
import LoginForm from './components/LoginForm'
import s from './styles'
import { ILoginViewProps, ILoginViewState } from './types'

const initialState: ILoginViewState = {
  loginEmail: '',
  loginPassword: '',
}

const LoginView: FC<ILoginViewProps> = ({
  showDialog,
  hideDialog,
  isDialogVisible,
  onPressLogin,
  isLoading,
  onPressLogout,
  styles,
  texts,
  userFirstName,
  loginApiError,
  brandImages,
  isShowPasswordButtonVisible,
  content,
  onPressForgotPassword,
  restorePasswordProps,
  resultDialogPropsProps,
}) => {
  const [data, setData] = useState<ILoginViewState>(initialState)
  const { loginEmail, loginPassword } = data

  const loginEmailError = useDebounced(loginEmail, validateEmail)
  const loginPasswordError = useDebounced(loginPassword, (value: string) =>
    validateMinLength(value, 6, 'Password')
  )

  const handleOnPressLogin = () => {
    onPressLogin({
      email: loginEmail,
      password: loginPassword,
    })
  }

  const logoutTitle = texts?.logoutDialog?.title
    ? texts.logoutDialog.title
    : 'Are you sure that you want to logout?'

  const logoutMessage = texts?.logoutDialog?.message
    ? texts.logoutDialog.message
    : 'You will need to enter your login data again to place the order.'

  const logoutConfirm = texts?.logoutDialog?.confirm
    ? texts.logoutDialog.confirm
    : 'Yes, logout'

  const logoutCancel = texts?.logoutDialog?.cancel
    ? texts.logoutDialog.cancel
    : 'No'

  const line1 = texts?.line1 || 'Got a TICKETFAIRY account?'

  const line2 = texts?.line2 || 'Login & skip ahead:'

  const handleLogout = () => {
    setData(initialState)
    if (onPressLogout) {
      onPressLogout()
    }
  }

  const checkIsLoginDataValid = (): boolean => {
    if (loginEmailError) {
      return false
    }
    if (loginPasswordError) {
      return false
    }
    return true
  }

  const LoggedComponent = () => (
    <View style={styles?.loggedIn?.container}>
      <Text style={styles?.loggedIn?.placeholder}>
        {texts?.loggedIn?.loggedAs || 'Logged in as:'}{' '}
        <Text style={styles?.loggedIn?.value}>{userFirstName}</Text>
      </Text>
      <Text style={styles?.loggedIn?.message}>
        {texts?.loggedIn?.notYou || 'Not you?'}
      </Text>
      <Button
        text={texts?.logoutButton || 'LOGOUT'}
        onPress={handleOnPressLogout}
        styles={{ container: s.button, ...styles?.loggedIn?.button }}
      />
    </View>
  )

  const GuestComponent = () => (
    <>
      {texts?.message ? (
        <Text style={styles?.guest?.message}>{texts?.message}</Text>
      ) : (
        <View style={styles?.guest?.linesContainer}>
          <Text style={styles?.guest?.line1}>{line1}</Text>
          <Text style={styles?.guest?.line2}>{line2}</Text>
        </View>
      )}
      <Button
        styles={{ container: s.button, ...styles?.guest?.loginButton }}
        text={texts?.loginButton || 'LOGIN'}
        onPress={showDialog}
      />
    </>
  )

  const BrandImages = useMemo(
    () => (
      <View style={brandImages?.containerStyle}>
        <Image
          source={brandImages?.image1 || R.images.brand}
          style={[s.brand, brandImages?.image1Style]}
        />

        {brandImages?.image2 && (
          <Image source={brandImages.image2} style={brandImages?.image2Style} />
        )}
      </View>
    ),
    [
      brandImages?.containerStyle,
      brandImages?.image1,
      brandImages?.image1Style,
      brandImages?.image2,
      brandImages?.image2Style,
    ]
  )

  //#region Button Press
  const handleOnPressLogout = () => {
    Alert.alert(logoutTitle, logoutMessage, [
      {
        text: logoutConfirm,
        onPress: handleLogout,
        style: 'destructive',
      },
      {
        text: logoutCancel,
      },
    ])
  }
  //#endregion Button Press

  //#region Text Changed
  const handleOnLoginEmailChanged = (text: string) =>
    setData({ ...data, loginEmail: text })

  const handleOnLoginPasswordChanged = (text: string) =>
    setData({ ...data, loginPassword: text })
  //#endregion Text Changed

  const renderContent = () => {
    switch (content) {
      case 'login':
        return (
          <LoginForm
            email={loginEmail}
            emailError={loginEmailError}
            onEmailChanged={handleOnLoginEmailChanged}
            password={loginPassword}
            passwordError={loginPasswordError}
            onPasswordChanged={handleOnLoginPasswordChanged}
            onPressLoginButton={handleOnPressLogin}
            onPressForgotPassword={onPressForgotPassword}
            viewProps={{
              styles: styles,
              texts: texts,
            }}
            loginApiError={loginApiError}
            isLoginButtonDisabled={!checkIsLoginDataValid()}
            isLoading={isLoading}
            brandImages={BrandImages}
            isShowPasswordButtonVisible={isShowPasswordButtonVisible}
          />
        )

      case 'restorePassword':
        return (
          <RestorePassword
            onPressRestorePasswordButton={
              restorePasswordProps.onPressRestorePasswordButton
            }
            onPressCancelButton={restorePasswordProps.onPressCancelButton}
            styles={styles?.restorePassword}
            texts={texts?.restorePassword}
            isLoading={restorePasswordProps.isLoading}
          />
        )

      case 'restorePasswordSuccess':
        return (
          <ResultDialog
            onPressButton={() => {
              resultDialogPropsProps?.onPressButton()
            }}
            message={resultDialogPropsProps?.message}
          />
        )

      default:
        return LoginForm
    }
  }

  //#region Render main component
  return (
    <View style={s.rootContainer}>
      {userFirstName ? LoggedComponent() : GuestComponent()}

      {isDialogVisible && (
        <Modal transparent={true} presentationStyle='overFullScreen'>
          <View style={s.touchableContainer}>
            <TouchableOpacity style={s.dismissibleArea} onPress={hideDialog}>
              <TouchableOpacity activeOpacity={1}>
                {renderContent()}
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  )
  //#endregion Render main component
}

export default LoginView
