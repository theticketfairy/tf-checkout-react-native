import React, { FC, useMemo, useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { useDebounced } from '../../helpers/Debounced'
import {
  validateEmail,
  validateMinLength,
  validatePasswords,
} from '../../helpers/Validators'
import R from '../../res'
import Button from '../button/Button'
import Input from '../input/Input'
import s from './styles'
import { ILoginViewProps, ILoginViewState } from './types'

const initialState: ILoginViewState = {
  loginEmail: '',
  loginPassword: '',
  restorePasswordEmail: '',
  resetPasswordNewPassword: '',
  resetPasswordNewPasswordConfirmation: '',
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
  loginError,
  refs,
  brandImages,
  isShowPasswordButtonVisible,
  content,
  onPressForgotPassword,
  restorePasswordProps: {
    onPressRestorePassword,
    restorePasswordError,
    restorePasswordViewProps,
    isRestorePasswordLoading,
  },
  restorePasswordSuccessProps: {
    restorePasswordSuccessViewProps,
    restorePasswordSuccessMessage,
  },
  resetPasswordProps: {},
}) => {
  const [data, setData] = useState<ILoginViewState>(initialState)
  const {
    loginEmail,
    loginPassword,
    resetPasswordNewPassword,
    resetPasswordNewPasswordConfirmation,
    restorePasswordEmail,
  } = data

  const loginEmailError = useDebounced(loginEmail, validateEmail)
  const loginPasswordError = useDebounced(loginPassword, (value: string) =>
    validateMinLength(value, 6, 'Password')
  )
  const restorePasswordEmailError = useDebounced(
    restorePasswordEmail,
    validateEmail
  )

  const resetPasswordNewPasswordError = useDebounced(
    resetPasswordNewPassword,
    () =>
      validatePasswords(
        resetPasswordNewPassword,
        resetPasswordNewPasswordConfirmation
      )
  )

  const resetPasswordNewPasswordConfirmationError = useDebounced(
    resetPasswordNewPasswordConfirmation,
    () =>
      validatePasswords(
        resetPasswordNewPassword,
        resetPasswordNewPasswordConfirmation
      )
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

  const checkIsLoginDataValid = (): boolean => {
    if (loginEmailError) {
      return false
    }
    if (loginPasswordError) {
      return false
    }
    return true
  }

  const checkIsRestorePasswordDataValid = (): boolean => {
    if (restorePasswordEmailError) {
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

  const ForgotPasswordButton = (
    <Text onPress={onPressForgotPassword}>Forgot Password</Text>
  )

  const LoginForm = (
    <View style={[s.dialog, styles?.dialog?.container]}>
      <Text style={[s.dialogTitle, styles?.dialog?.title]}>
        {texts?.dialog?.title || 'Login'}
      </Text>
      {BrandImages}
      {!!texts?.dialog?.message && (
        <Text style={[s.message, styles?.dialog?.message]}>
          {texts.dialog.message}
        </Text>
      )}
      <Input
        label={texts?.dialog?.emailLabel || 'Email'}
        error={loginEmailError}
        keyboardType='email-address'
        value={loginEmail}
        onChangeText={(text: string) => setData({ ...data, loginEmail: text })}
        autoCapitalize='none'
      />
      <Input
        label={texts?.dialog?.passwordLabel || 'Password'}
        error={loginPasswordError}
        keyboardType='default'
        value={loginPassword}
        onChangeText={(text: string) =>
          setData({ ...data, loginPassword: text })
        }
        autoCapitalize='none'
        secureTextEntry={true}
        isShowPasswordButtonVisible={isShowPasswordButtonVisible}
      />
      {!!loginError && <Text style={[s.error]}>{loginError}</Text>}
      {ForgotPasswordButton}
      <Button
        styles={
          !checkIsLoginDataValid()
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
        onPress={handleOnPressLogin}
        isLoading={isLoading}
        isDisabled={!checkIsLoginDataValid()}
        //@ts-ignore
        ref={refs?.button}
      />
    </View>
  )

  const handleOnPressRestorePassword = () => {
    // setIsRestorePasswordLoading(true)
    onPressRestorePassword(restorePasswordEmail)
    //setIsRestorePasswordLoading(false)
  }

  const RestorePasswordForm = (
    <View style={[s.dialog, styles?.dialog?.container]}>
      <Text style={[s.dialogTitle, styles?.dialog?.title]}>
        {restorePasswordViewProps?.texts?.title || 'Forgot Password'}
      </Text>

      <Input
        label={restorePasswordViewProps?.texts?.emailLabel || 'Email'}
        error={restorePasswordEmailError}
        keyboardType='email-address'
        value={restorePasswordEmail}
        onChangeText={(text: string) =>
          setData({ ...data, restorePasswordEmail: text })
        }
        autoCapitalize='none'
      />

      {!!restorePasswordError && <Text>{restorePasswordError}</Text>}

      <Button
        text={
          restorePasswordViewProps?.texts?.restorePasswordButton ||
          'Restore password'
        }
        onPress={handleOnPressRestorePassword}
        isLoading={isRestorePasswordLoading}
        isDisabled={!checkIsRestorePasswordDataValid()}
      />
    </View>
  )

  const RestorePasswordSuccessForm = (
    <View
      style={[s.dialog, restorePasswordSuccessViewProps?.styles?.container]}
    >
      <Text
        style={[s.dialogTitle, restorePasswordSuccessViewProps?.styles?.title]}
      >
        {restorePasswordSuccessViewProps?.texts?.title || 'Email Sent!'}
      </Text>

      {!!restorePasswordSuccessMessage && (
        <Text>{restorePasswordSuccessMessage}</Text>
      )}

      <Button
        text={
          restorePasswordSuccessViewProps?.texts?.button || 'Restore password'
        }
        onPress={hideDialog}
      />
    </View>
  )

  const ResetPassword = (
    <View style={[s.dialog, styles?.dialog?.container]}>
      <Text style={[s.dialogTitle, styles?.dialog?.title]}>
        {restorePasswordSuccessViewProps?.texts?.title ||
          'Enter your new password'}
      </Text>

      <Button
        text={restorePasswordSuccessViewProps?.texts?.button || 'OK'}
        onPress={handleOnPressRestorePassword}
        isLoading={isRestorePasswordLoading}
      />
    </View>
  )

  const renderContent = () => {
    switch (content) {
      case 'login':
        return LoginForm

      case 'restorePassword':
        return RestorePasswordForm

      case 'restorePasswordSuccess':
        return RestorePasswordSuccessForm

      case 'resetPassword':
        return ResetPassword

      default:
        return LoginForm
    }
  }

  return (
    <View style={s.rootContainer}>
      {userFirstName ? LoggedComponent() : GuestComponent()}

      {isDialogVisible && (
        <Modal transparent={true} presentationStyle='overFullScreen'>
          <View style={s.touchableContainer}>
            <TouchableOpacity style={s.dismissibleArea} onPress={hideDialog}>
              <TouchableWithoutFeedback>
                {renderContent()}
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default LoginView
