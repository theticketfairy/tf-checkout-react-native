import React from 'react'
import { Image, Text, View } from 'react-native'

import R from '../../../res'
import { NotificationStyles as s } from './styles'

export interface INotificationProps {
  isSuccess: boolean
  text?: string
}

const Notification = ({ isSuccess, text }: INotificationProps) => {
  const textToShow = text
    ? text
    : isSuccess
    ? 'File downloaded successfully'
    : 'There was an error downloading the file'
  return (
    <View style={s.rootContainer}>
      <Text style={s.text}>{textToShow}</Text>
      <Image
        source={isSuccess ? R.icons.check : R.icons.error}
        style={isSuccess ? s.iconSuccess : s.iconError}
      />
    </View>
  )
}

export default Notification
