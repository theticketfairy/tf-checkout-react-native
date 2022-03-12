import React from 'react'
import { Text, View } from 'react-native'

import { Button, Input } from '..'
import s from './styles'
import { IWaitingListViewProps } from './types'

const WaitingListView = ({
  styles,
  texts,
  onPressButton,
  data,
  isSuccess,
  isLoading,
}: IWaitingListViewProps) => {
  const {
    firstName,
    lastName,
    email,
    emailError,
    lastNameError,
    firstNameError,
    onChangeEmail,
    onChangeFirstName,
    onChangeLastName,
  } = data

  const getIsDataValid = () =>
    firstName.length > 0 &&
    lastName.length > 0 &&
    email.length > 0 &&
    !emailError &&
    !lastNameError &&
    !firstNameError

  const isDataValid = getIsDataValid()

  const buttonStyle = isDataValid
    ? styles?.button
    : styles?.buttonDisabled
    ? styles?.buttonDisabled
    : styles?.button

  return (
    <View style={styles?.rootContainer}>
      {isSuccess ? (
        <View style={styles?.success?.container}>
          <Text style={styles?.success?.title}>
            {texts?.successTitle || `You've been added to the waiting list!`}
          </Text>
          <Text style={styles?.success?.message}>
            {texts?.successMessage ||
              `You'll be notified if tickets become available.`}
          </Text>
        </View>
      ) : (
        <>
          <Text style={[s.title, styles?.title]}>
            {texts?.title || 'Waiting list'}
          </Text>
          <Input
            label={texts?.firstName || 'First name'}
            value={firstName}
            onChangeText={onChangeFirstName}
            error={firstNameError}
            styles={styles?.input}
          />
          <Input
            label={texts?.lastName || 'Last name'}
            value={lastName}
            onChangeText={onChangeLastName}
            error={lastNameError}
            styles={styles?.input}
          />
          <Input
            label={texts?.email || 'Email'}
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={onChangeEmail}
            error={emailError}
            styles={styles?.input}
          />
          <Button
            onPress={onPressButton}
            text={texts?.button || 'ADD TO WAITING LIST'}
            styles={buttonStyle}
            isDisabled={!isDataValid}
            isLoading={isLoading}
          />
        </>
      )}
    </View>
  )
}

export default WaitingListView
