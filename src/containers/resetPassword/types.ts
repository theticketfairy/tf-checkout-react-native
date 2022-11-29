import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IRestorePasswordData } from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import { IInputStyles } from '../../components/input/types'
import { IError } from '../../types'

export interface IResetPasswordTexts {
  title?: string
  resetButton?: string
  cancelButton?: string
  newPasswordLabel?: string
  confirmNewPasswordLabel?: string
}

export interface IResetPasswordStyles {
  rootContainer?: StyleProp<ViewStyle>
  contentContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  resetButton?: IButtonStyles
  cancelButton?: IButtonStyles
  input?: IInputStyles
  apiError?: StyleProp<TextStyle>
  apiSuccess?: StyleProp<TextStyle>
}

export interface IResetPasswordProps {
  token: string
  styles?: IResetPasswordStyles
  texts?: IResetPasswordTexts

  onResetPasswordSuccess?: (data: IRestorePasswordData) => void
  onResetPasswordError?: (error: IError) => void

  onPressResetButton?: () => void
  onPressCancelButton?: () => void
}

export interface IResetPasswordViewProps {
  styles?: IResetPasswordStyles
  texts?: IResetPasswordTexts

  onChangePassword: (value: string) => void
  onChangePasswordConfirm: (value: string) => void
  apiError?: string
  apiSuccess?: string
  isLoading?: boolean
  isDataValid?: boolean
  password: string
  passwordConfirm: string
  passwordError?: string
  passwordConfirmError?: string

  onPressResetButton: () => void
  onPressCancelButton: () => void
}
