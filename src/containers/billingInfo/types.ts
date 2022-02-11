import {
  ColorValue,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IButtonStyles } from '../../components/button/types'
import { ICheckboxStyles } from '../../components/checkbox/types'
import { IDatePickerStyles } from '../../components/datePicker/types'
import { IDropdownItem, IDropdownStyles } from '../../components/dropdown/types'
import { IFormFieldProps } from '../../components/formField/types'
import { IInputStyles } from '../../components/input/types'
import { ILoginViewStyles, ILoginViewTexts } from '../../components/login/types'
import { IUserProfile } from '../../types'
import { IAddToCartSuccess } from '../tickets/types'

export interface ITokens {
  accessToken: string
  refreshToken: string
}

export interface IOnCheckoutSuccess {
  id: string
  hash: string
  total: string
  status: string
}

export interface IBillingProps {
  cartProps: IAddToCartSuccess
  onRegisterSuccess?: (tokens: ITokens) => void
  onRegisterFail?: (error: string) => void

  onCheckoutSuccess: (data: IOnCheckoutSuccess) => void
  onCheckoutFail?: (error: string) => void

  onLoginSuccess: (data: any) => void
  onLoginFail?: (error: string) => void

  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileFail?: (error: any) => void

  onFetchCartError?: (error: string) => void

  privacyPolicyLinkStyle?: StyleProp<TextStyle>

  onFetchUserProfileFailure?: (error: string) => void
  onFetchAccessTokenFailure?: (error: string) => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts
}

export interface IBillingInfoProps {
  cartProps: IAddToCartSuccess
  onRegisterSuccess?: (tokens: ITokens) => void
  onRegisterFail?: (error: string) => void

  onCheckoutSuccess: (data: IOnCheckoutSuccess) => void
  onCheckoutFail?: (error: string) => void

  onLoginSuccess: (data: any) => void
  onLoginFail?: (error: string) => void

  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileFail?: (error: any) => void

  onFetchCartError?: (error: string) => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  privacyPolicyLinkStyle?: StyleProp<TextStyle>

  onFetchUserProfileFailure?: (error: string) => void
  onFetchAccessTokenFailure?: (error: string) => void
}

export interface ITicketHolderField {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface ITicketHolderFieldError {
  firstNameError?: string
  lastNameError?: string
}

export interface IBillingInfoFormData {
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  password: string
  confirmPassword: string
  phone: string
  street: string
  city: string
  country?: IDropdownItem
  state?: IDropdownItem
  zipCode: string
  isSubToNewsletter: boolean
  isSubToMarketing: boolean
  ticketHoldersFields: ITicketHolderField[]
  birthday?: Date

  errors: {
    firstName: string
    lastName: string
    email: string
    confirmEmail: string
    password: string
    confirmPassword: string
    phone: string
    street: string
    city: string
    zipCode: string
  }
}

export interface IBillingInfoViewStyles {
  rootContainer?: StyleProp<ViewStyle>
  loginStyles?: ILoginViewStyles
  checkoutButton?: IButtonStyles
  checkoutButtonDisabled?: IButtonStyles
  passwordTitle?: StyleProp<TextStyle>

  inputStyles?: IInputStyles
  dropdownStyles?: IDropdownStyles
  checkboxStyles?: ICheckboxStyles

  titles?: StyleProp<TextStyle>
  headers?: StyleProp<TextStyle>
  texts?: StyleProp<TextStyle>
  customCheckbox?: ICheckboxStyles

  datePicker?: IDatePickerStyles
  skippingDialog?: {
    rootContainer?: StyleProp<ViewStyle>
    dialogContainer?: StyleProp<ViewStyle>
    brandImage?: StyleProp<ImageStyle>
    message?: StyleProp<TextStyle>
    spinner?: {
      color: ColorValue
      size: 'large' | 'small'
    }
  }
}

export interface IBillingInfoViewTexts {
  loginTexts?: ILoginViewTexts
  loginButton?: string
  checkoutButton?: string
  passwordTitle?: string
  brandCheckBox?: string
  skippingMessage?: string
}

export interface IBillingInfoViewProps {
  formFields: IFormFieldProps[]
  isLoading: boolean
  onSubmit: () => void
  onLoginSuccessful: (userProfile: IUserProfile, accessToken: string) => void
  isDataValid: boolean
  isLoginDialogVisible: boolean
  showLoginDialog: () => void
  hideLoginDialog: () => void
  loginMessage?: string
  userProfile?: IUserProfile
  isSubmitLoading?: boolean
  onLogoutSuccess?: () => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  onLoginFail?: (error: string) => void
  onFetchUserProfileFailure?: (error: string) => void
  onFetchAccessTokenFailure?: (error: string) => void
}
