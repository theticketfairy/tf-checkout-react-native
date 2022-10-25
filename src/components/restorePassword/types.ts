import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IResetPasswordRequestData } from '../../api/types'
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

export interface IResetPasswordCoreProps {
  isLoading?: boolean
  onPressResetButton: (data: IResetPasswordRequestData) => void
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
export interface IRestorePasswordSuccessStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  message?: StyleProp<TextStyle>
  button?: IButtonStyles
}

export interface IRestorePasswordSuccessTexts {
  title?: string
  message?: string
  button?: string
}

export interface IRestorePasswordSuccessCoreProps {
  onPressButton: () => void
}

export interface IRestorePasswordSuccessProps
  extends IRestorePasswordSuccessCoreProps {
  styles?: IRestorePasswordSuccessStyles
  texts?: IRestorePasswordSuccessTexts
}
//#endregion
