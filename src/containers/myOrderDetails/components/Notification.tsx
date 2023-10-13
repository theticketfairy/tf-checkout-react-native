import React, { type FC } from 'react'
import { Image, type ImageSourcePropType, Text, View } from 'react-native'

import R from '../../../res'
import { NotificationStyles as s } from './styles'

export interface INotificationIcons {
  success?: ImageSourcePropType
  error?: ImageSourcePropType
}

export interface INotificationProps {
  isSuccess: boolean
  textSuccess?: string
  textError?: string

  icons?: INotificationIcons
}



const Notification: FC<INotificationProps> = ({
  isSuccess,
  textSuccess = 'File downloaded successfully',
  textError = 'There was an error downloading the file',
  icons,
}) => {
  const textToShow = isSuccess ? textSuccess : textError
  const successIcon = icons?.success || R.icons.check
  const errorIcon = icons?.error || R.icons.error
  return (
    <View style={s.rootContainer}>
      <Text style={s.text}>{textToShow}</Text>
      <Image
        source={isSuccess ? successIcon : errorIcon}
        style={isSuccess ? s.iconSuccess : s.iconError}
      />
    </View>
  )
}

export default Notification
