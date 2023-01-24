import React from 'react'

import { ILoginDialogViewProps } from '../types'

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
