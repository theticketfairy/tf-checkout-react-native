import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'
import { IInputStyles } from '../input/types'

//#region ResetPassword
export interface IResetPasswordDialogStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  button?: IButtonStyles
  input?: IInputStyles
  apiError?: StyleProp<TextStyle>
}

export interface IResetPasswordDialogTexts {
  title?: string
  button?: string
  inputLabel?: string
}

export interface IResetPasswordDialogProps {
  styles?: IResetPasswordDialogStyles
  texts?: IResetPasswordDialogTexts
  isLoading?: boolean
  onPressResetButton: (newPassword: string, confirmNewPassword: string) => void
  apiError?: string
}
//#endregion ResetPassword

//#region RestorePasswordDialog
export interface IRestorePasswordDialogTexts {
  restorePasswordButton?: string
  cancelButton?: string
  message?: string
  inputLabel?: string
  title?: string
}

export interface IRestorePasswordDialogStyles {
  rootContainer?: StyleProp<ViewStyle>
  restorePasswordButton?: IButtonStyles
  cancelRestorePasswordButton?: IButtonStyles
  input?: IInputStyles
  title?: StyleProp<TextStyle>
  message?: StyleProp<TextStyle>
  apiError?: StyleProp<TextStyle>
}

export interface IRestorePasswordDialogProps {
  styles?: IRestorePasswordDialogStyles
  texts?: IRestorePasswordDialogTexts

  restorePasswordInputError?: string
  restorePasswordApiError?: string
  onPressRestorePasswordButton: (email: string) => void
  onPressCancelButton: () => void
  isButtonDisabled?: boolean
  isLoading?: boolean
}
//#endregion RestorePasswordForm

//#region RestorePasswordSuccessDialog
export interface IRestorePasswordSuccessDialogStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  message?: StyleProp<TextStyle>
  button?: IButtonStyles
}

export interface IRestorePasswordSuccessDialogTexts {
  title?: string
  message?: string
  button?: string
}

export interface IRestorePasswordSuccessDialogProps {
  styles?: IRestorePasswordSuccessDialogStyles
  texts?: IRestorePasswordSuccessDialogTexts
  onPressButton: () => void
}
//#endregion
