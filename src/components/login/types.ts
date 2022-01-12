import { ImageStyle } from 'react-native'
import { TextInputProps, TextStyle } from 'react-native'
import { StyleProp, ViewStyle } from 'react-native'

import { IUserProfile } from '../../types'
import { IButtonStyles } from '../button/types'
import { IFormField } from '../formField/types'

export interface ILoginProps {
  onLoginSuccessful: (userProfile: IUserProfile, accessToken: string) => void
  onLoginFailure: () => void
  message?: string
  isLoginDialogVisible: boolean
  showLoginDialog: () => void
  hideLoginDialog: () => void
  userProfileProp?: IUserProfile

  onLogoutSuccess?: () => void
  onLogoutFail?: () => void

  styles?: ILoginViewStyles
  texts?: ILoginViewTexts
}

export interface ILoginViewStyles {
  loginButton?: IButtonStyles
  dialog?: {
    container?: StyleProp<ViewStyle>
    loginButton?: IButtonStyles
    input?: TextInputProps['style']
    title?: StyleProp<TextStyle>
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
  dialog?: {
    loginButton?: string
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
  message?: string
  userProfile?: IUserProfile

  onPressLogout: () => void
  onLogoutSuccess?: () => void
  onLogoutFail?: () => void

  styles?: ILoginViewStyles
  texts?: ILoginViewTexts
}

export interface ILoginViewState {
  email: IFormField
  password: IFormField
  isDataValid: boolean
}
