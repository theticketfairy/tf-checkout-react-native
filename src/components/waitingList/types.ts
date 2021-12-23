import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'

export interface IWaitingListTexts {
  title?: string
  firstName?: string
  lastName?: string
  email?: string
  button?: string
}

export interface IWaitingListStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  button?: IButtonStyles
  success?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<ViewStyle>
    message?: StyleProp<ViewStyle>
  }
}

export interface IWaitingListViewProps {
  data: {
    firstName: string
    lastName: string
    email: string

    firstNameError?: string
    lastNameError?: string
    emailError?: string

    onChangeFirstName: (value: string) => void
    onChangeLastName: (value: string) => void
    onChangeEmail: (value: string) => void
  }
  onPressButton: () => void
  isSuccess?: boolean
  styles?: IWaitingListStyles
  texts?: IWaitingListTexts
  isLoading?: boolean
}

export interface IWaitingListProps {
  eventId: number
  styles?: IWaitingListStyles
  texts?: IWaitingListTexts
}

export interface IWaitingListFields {
  ticketTypeId: string
  quantity: string
  firstName: string
  lastName: string
  email: string
}
