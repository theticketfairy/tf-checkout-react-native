import type React from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { IButtonStyles } from 'src/components/button/types'

import type { ILoginDialogViewProps } from '../types'

//#region LoginForm
export interface ILoginFormProps {
  viewProps?: ILoginDialogViewProps
  email: string
  emailError?: string
  onEmailChanged: (text: string) => void
  password: string
  passwordError?: string
  onPasswordChanged: (text: string) => void
  loginApiError?: string
  onPressLoginButton: () => void
  isLoading?: boolean
  isShowPasswordButtonVisible?: boolean
  onPressForgotPassword: () => void
  isLoginButtonDisabled?: boolean
  brandImages?: React.ReactNode
}
//#endregion LoginForm

export interface ILoginGuestComponentProps {
  styles?: ILoginGuestComponentStyles
  texts?: ILoginGuestComponentTexts
  onPressButton: () => void
}

export interface ILoginGuestComponentTexts {
  message?: string
  line1?: string
  line2?: string
  loginButton?: string
}

export interface ILoginGuestComponentStyles {
  loginButton?: IButtonStyles
  linesContainer?: StyleProp<ViewStyle>
  line1?: StyleProp<TextStyle>
  line2?: StyleProp<TextStyle>
  message?: StyleProp<TextStyle>
}

export interface ILoginLoggedComponentProps {
  styles?: ILoginLoggedComponentStyles
  texts?: ILoginLoggedComponentTexts
  onPressLogout: () => void
  userFirstName: string
}

export interface ILoginLoggedComponentStyles {
  container?: StyleProp<ViewStyle>
  placeholder?: StyleProp<TextStyle>
  value?: StyleProp<TextStyle>
  button?: IButtonStyles
  message?: StyleProp<TextStyle>
}

export interface ILoginLoggedComponentTexts {
  loggedAs?: string
  notYou?: string
  logoutButton?: string
}
