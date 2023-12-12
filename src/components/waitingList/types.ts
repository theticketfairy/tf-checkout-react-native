import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

import type { IError } from '../../types'
import type { IButtonStyles } from '../button/types'
import type { IInputStyles } from '../input/types'

export interface IWaitingListTexts {
  title?: string
  firstName?: string
  lastName?: string
  email?: string
  button?: string
  successTitle?: string
  successMessage?: string
}

export interface IWaitingListStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  button?: IButtonStyles
  buttonDisabled?: IButtonStyles
  input?: IInputStyles
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
  styles?: IWaitingListStyles
  texts?: IWaitingListTexts

  onAddToWaitingListSuccess?: () => void
  onAddToWaitingListError?: (error: IError) => void

  onLoadingChange?: (isLoading: boolean) => void
  areAlertsEnabled?: boolean
}

export interface IWaitingListFields {
  ticketTypeId: string
  quantity: string
  firstName: string
  lastName: string
  email: string
}
