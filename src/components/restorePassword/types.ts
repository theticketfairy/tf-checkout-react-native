import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'
import { IInputStyles } from '../input/types'

//#region ResetPassword
export interface IResetPasswordStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  button?: IButtonStyles
  input?: IInputStyles
  apiError?: StyleProp<TextStyle>
}

export interface IResetPasswordTexts {
  title?: string
  button?: string
  inputLabel?: string
}

export interface IResetPasswordButtonPayload {
  password: string
  confirmPassword: string
}

export interface IResetPasswordCoreProps {
  isLoading?: boolean
  onPressResetButton: (data: IResetPasswordButtonPayload) => void
  onPressCancelButton: () => void
  apiError?: string
}
export interface IResetPasswordProps extends IResetPasswordCoreProps {
  styles?: IResetPasswordStyles
  texts?: IResetPasswordTexts
}
//#endregion ResetPassword

//#region RestorePassword
export interface IRestorePasswordTexts {
  restorePasswordButton?: string
  cancelButton?: string
  message?: string
  inputLabel?: string
  title?: string
}

export interface IRestorePasswordStyles {
  rootContainer?: StyleProp<ViewStyle>
  restorePasswordButton?: IButtonStyles
  cancelRestorePasswordButton?: IButtonStyles
  input?: IInputStyles
  title?: StyleProp<TextStyle>
  message?: StyleProp<TextStyle>
  apiError?: StyleProp<TextStyle>
}

export interface IRestorePasswordCoreProps {
  apiError?: string
  onPressRestorePasswordButton: (email: string) => void
  onPressCancelButton: () => void
  isLoading?: boolean
}

export interface IRestorePasswordProps extends IRestorePasswordCoreProps {
  styles?: IRestorePasswordStyles
  texts?: IRestorePasswordTexts
}
//#endregion RestorePasswordForm

//#region RestorePasswordSuccess
export interface IResultDialogStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  message?: StyleProp<TextStyle>
  button?: IButtonStyles
}

export interface IResultDialogTexts {
  title?: string
  message?: string
  button?: string
}

export interface IResultDialogCoreProps {
  message?: string
  onPressButton: () => void
}

export interface IResultDialogProps extends IResultDialogCoreProps {
  styles?: IResultDialogStyles
  texts?: IResultDialogTexts
}
//#endregion
