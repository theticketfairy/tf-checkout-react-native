import React from 'react'

import { ILoginDialogViewProps, IRestorePasswordViewProps } from '../types'

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

//#region RestorePasswordForm
export interface IRestorePasswordFormProps {
  viewProps?: IRestorePasswordViewProps
  restorePasswordInputError?: string
  email: string
  onEmailChanged: (text: string) => void
  restorePasswordApiError?: string
  onPressRestorePasswordButton: () => void
  onPressCancelButton: () => void
  isButtonDisabled?: boolean
  isLoading?: boolean
}
//#endregion RestorePasswordForm
