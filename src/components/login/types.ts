import { ImageSourcePropType, ImageStyle } from 'react-native'
import { TextStyle } from 'react-native'
import { StyleProp, ViewStyle } from 'react-native'

import { IUserProfile } from '../../types'
import { IButtonStyles } from '../button/types'
import { IFormField } from '../formField/types'
import { IInputStyles } from '../input/types'

export interface ILoginRefs {
  inputs?: {
    email?: any
    password?: any
  }
  button?: {
    containerView?: any
    touchableOpacity?: any
    loadingView?: any
    activityIndicator?: any
    loadingText?: any
  }
}

export interface ILoginProps {
  onLoginSuccessful: (userProfile: IUserProfile, accessToken: string) => void
  onLoginFailure?: (error: string) => void
  onFetchUserProfileFailure?: (error: string) => void
  onFetchAccessTokenFailure?: (error: string) => void
  isLoginDialogVisible: boolean
  showLoginDialog: () => void
  hideLoginDialog: () => void

  onLogoutSuccess?: () => void
  onLogoutFail?: () => void

  styles?: ILoginViewStyles
  texts?: ILoginViewTexts

  userFirstName?: string
  refs?: ILoginRefs

  logoImage?: ImageSourcePropType
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
    logo?: StyleProp<ImageStyle>
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
  }
  logoutDialog?: {
    title?: string
    message?: string
    confirm?: string
    cancel?: string
  }
}

export interface ILoginViewProps {
  showDialog: () => void
  hideDialog: () => void
  isDialogVisible: boolean
  onPressLogin: (email: string, password: string) => void
  isLoading: boolean
  userProfile?: IUserProfile

  onPressLogout: () => void
  onLogoutSuccess?: () => void
  onLogoutFail?: () => void

  styles?: ILoginViewStyles
  texts?: ILoginViewTexts

  loginError?: string
  userFirstName?: string

  refs?: ILoginRefs

  logoImage?: ImageSourcePropType
}

export interface ILoginViewState {
  email: IFormField
  password: IFormField
  isDataValid: boolean
}
