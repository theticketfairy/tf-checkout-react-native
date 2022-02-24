//@ts-nocheck

import _map from 'lodash/map'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import R from '../../res'
import Button from '../button/Button'
import FormField from '../formField/FormField'
import { IFormFieldProps } from '../formField/types'
import s from './styles'
import { ILoginViewProps, ILoginViewState } from './types'

const initialState: ILoginViewState = {
  isDataValid: false,
  email: {
    value: '',
    error: undefined,
  },
  password: {
    value: '',
    error: undefined,
  },
}

const LoginView = ({
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
}: ILoginViewProps) => {
  const [data, setData] = useState<ILoginViewState>(initialState)
  const { email, password } = data
  const getFormFields = (): IFormFieldProps[] => {
    const setInputData = (id: string, value: string) => {
      setData({ ...data, [id]: { value: value } })
    }

    return [
      {
        fieldType: 'input',
        id: 'email',
        inputProps: {
          value: email.value as string,
          onTextChanged: setInputData,
          label: 'Email',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          styles: styles?.dialog?.input,
          reference: refs?.inputs?.email,
        },
      },
      {
        fieldType: 'input',
        id: 'password',
        inputProps: {
          value: password.value as string,
          onTextChanged: setInputData,
          label: 'Password',
          secureTextEntry: true,
          styles: styles?.dialog?.input,
          reference: refs?.inputs?.password,
        },
      },
    ]
  }

  const formFields = useMemo(getFormFields, [data, email.value, password.value])

  const renderFormFields = useCallback(() => {
    return _map(formFields, (item, index) => (
      <FormField {...item} key={`loginModal.${index}.${item.id}`} />
    ))
  }, [formFields])

  const checkIsDataValid = (): boolean => {
    if (email.value.toString().length === 0) {
      return false
    }
    if (password.value.toString().length < 5) {
      return false
    }
    return true
  }

  const handleOnPressLogin = () => {
    onPressLogin(email.value as string, password.value as string)
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

  const LoggedComponent = () => (
    <View style={styles?.loggedIn?.container}>
      <Text style={styles?.loggedIn?.placeholder}>
        Logged in as:{' '}
        <Text style={styles?.loggedIn?.value}>{userFirstName}</Text>
      </Text>
      <Text style={styles?.loggedIn?.message}>Not you?</Text>
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

  return (
    <View style={s.rootContainer}>
      {userFirstName ? LoggedComponent() : GuestComponent()}

      {isDialogVisible && (
        <Modal transparent={true} presentationStyle='overFullScreen'>
          <View style={s.touchableContainer}>
            <TouchableOpacity style={s.dismissibleArea} onPress={hideDialog}>
              <TouchableWithoutFeedback>
                <View style={[s.dialog, styles?.dialog?.container]}>
                  <Text style={[s.dialogTitle, styles?.dialog?.title]}>
                    LOGIN
                  </Text>
                  <Image
                    source={R.images.brand}
                    style={[s.brand, styles?.dialog?.logo]}
                  />
                  {!!texts?.dialog?.message && (
                    <Text style={[s.message, styles?.dialog?.message]}>
                      {texts.dialog.message}
                    </Text>
                  )}
                  {renderFormFields()}
                  {!!loginError && <Text style={[s.error]}>{loginError}</Text>}
                  <Button
                    styles={
                      !checkIsDataValid()
                        ? styles?.dialog?.loginButtonDisabled
                        : {
                            container: [s.loginButton],
                            ...styles?.dialog?.loginButton,
                          }
                    }
                    text={texts?.loginButton || 'LOGIN'}
                    onPress={handleOnPressLogin}
                    isLoading={isLoading}
                    isDisabled={!checkIsDataValid()}
                    ref={refs?.button}
                  />
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default LoginView
