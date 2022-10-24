import { ImageSourcePropType, ImageStyle } from 'react-native'
import { TextStyle } from 'react-native'
import { StyleProp, ViewStyle } from 'react-native'

import { IResetPasswordRequestData } from '../../api/types'
import { IError, IUserProfilePublic } from '../../types'
import { IButtonStyles } from '../button/types'
import { IInputStyles } from '../input/types'
import { IRestorePasswordSuccessDialogProps } from './components/types'

export interface ILoginRefs {
  inputs?: {
    email?: any
    password?: any
    restorePasswordEmail?: any
  }
  button?: {
    containerView?: any
    touchableOpacity?: any
    loadingView?: any
    activityIndicator?: any
    loadingText?: any
  }
}

export interface ILoginBrandImages {
  containerStyle?: StyleProp<ViewStyle>
  image1?: ImageSourcePropType
  image1Style?: StyleProp<ImageStyle>
  image2?: ImageSourcePropType
  image2Style?: StyleProp<ImageStyle>
  showPassword?: ImageSourcePropType
  hidePassword?: ImageSourcePropType
  showPasswordStyle?: StyleProp<ImageStyle>
  hidePasswordStyle?: StyleProp<ImageStyle>
}

// Exported component
export interface ILoginProps {
  onLoginSuccessful: (userProfile: IUserProfilePublic) => void
  onLoginError?: (error: IError) => void

  isLoginDialogVisible: boolean
  showLoginDialog: () => void
  hideLoginDialog: () => void

  //Logout
  onLogoutSuccess?: () => void
  onLogoutError?: (error: IError) => void

  styles?: ILoginViewStyles
  texts?: ILoginViewTexts

  userFirstName?: string
  refs?: ILoginRefs

  brandImages?: ILoginBrandImages
  isShowPasswordButtonVisible?: boolean

  config?: {
    areActivityIndicatorsEnabled?: boolean
    areAlertsEnabled?: boolean
  }

  forgotPasswordViewProps?: IRestorePasswordViewProps

  //Restore password
  onRestorePasswordError?: (error: IError) => void
  onRestorePasswordSuccess?: () => void
  restorePasswordDialogProps?: IRestorePasswordViewProps

  dialogsProps?: {
    isShowPasswordButtonVisible?: boolean
    brandImages?: ILoginBrandImages
    login?: {
      styles?: {
        container?: StyleProp<ViewStyle>
        loginButton?: IButtonStyles
        loginButtonDisabled?: IButtonStyles
        input?: IInputStyles
        title?: StyleProp<TextStyle>
        message?: StyleProp<TextStyle>
        showPasswordIcon?: StyleProp<ImageStyle>
      }
      texts: {
        loginButton?: string
        message?: string
        emailLabel?: string
        passwordLabel?: string
        title?: string
      }
    }
    restorePassword?: {}
  }
}

export interface ILoginViewStyles {
  guest?: {
    loginButton?: IButtonStyles
    linesContainer?: StyleProp<ViewStyle>
    line1?: StyleProp<TextStyle>
    line2?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
  }
  dialog?: {
    container?: StyleProp<ViewStyle>
    loginButton?: IButtonStyles
    loginButtonDisabled?: IButtonStyles
    input?: IInputStyles
    title?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
    showPasswordIcon?: StyleProp<ImageStyle>
  }
  loggedIn?: {
    container?: StyleProp<ViewStyle>
    placeholder?: StyleProp<TextStyle>
    value?: StyleProp<TextStyle>
    button?: IButtonStyles
    message?: StyleProp<TextStyle>
  }
}

export interface ILoginViewTexts {
  loginButton?: string
  logoutButton?: string
  line1?: string
  line2?: string
  message?: string
  dialog?: {
    loginButton?: string
    message?: string
    emailLabel?: string
    passwordLabel?: string
    title?: string
  }
  logoutDialog?: {
    title?: string
    message?: string
    confirm?: string
    cancel?: string
  }
  loggedIn?: {
    loggedAs?: string
    notYou?: string
  }
}

//#region Login
export interface ILoginDialogViewProps {
  styles?: ILoginViewStyles
  texts?: ILoginViewTexts
}
//#endregion

export type LoginContentType =
  | 'login'
  | 'restorePassword'
  | 'restorePasswordSuccess'
  | 'resetPassword'

export interface ILoginViewProps {
  showDialog: () => void
  hideDialog: () => void
  isDialogVisible: boolean
  onPressLogin: (fields: ILoginFields) => void
  isLoading: boolean
  userProfile?: IUserProfilePublic

  onPressLogout: () => void

  styles?: ILoginViewStyles
  texts?: ILoginViewTexts

  loginApiError?: string
  userFirstName?: string

  refs?: ILoginRefs

  brandImages?: ILoginBrandImages

  isShowPasswordButtonVisible?: boolean

  content: LoginContentType

  // Used to start the Forgot Password flow
  onPressForgotPassword: () => void

  // Used to send the Restore password request to the server
  restorePasswordProps: {
    onPressRestorePasswordButton: (email: string) => void
    onPressCancelRestorePasswordButton: () => void
    restorePasswordViewProps?: IRestorePasswordViewProps
    isRestorePasswordLoading?: boolean
    restorePasswordApiError?: string
  }

  resetPasswordProps: {
    onPressResetPassword: (data: IResetPasswordRequestData) => void
    resetPasswordError?: string
    isResetPasswordLoading?: boolean
  }

  restorePasswordSuccessDialogProps?: IRestorePasswordSuccessDialogProps
}

export interface ILoginFields {
  email: string
  password: string
}

export interface ILoginViewState {
  loginEmail: string
  loginPassword: string
  restorePasswordEmail: string
  resetPasswordNewPassword: string
  resetPasswordNewPasswordConfirmation: string
}
