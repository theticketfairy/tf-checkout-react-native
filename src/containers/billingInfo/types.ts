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
import { IDropdownStyles } from '../../components/dropdown/types'
import { IFormFieldProps } from '../../components/formField/types'
import { IInputStyles } from '../../components/input/types'
import {
  ILoginBrandImages,
  ILoginViewStyles,
  ILoginViewTexts,
} from '../../components/login/types'
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

  loginBrandImages?: ILoginBrandImages
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

export interface IBillingInfoViewStyles {
  rootContainer?: StyleProp<ViewStyle>
  loginStyles?: ILoginViewStyles
  checkoutButton?: IButtonStyles
  checkoutButtonDisabled?: IButtonStyles
  passwordTitle?: StyleProp<TextStyle>

  inputStyles?: IInputStyles
  dropdownStyles?: IDropdownStyles
  checkboxStyles?: ICheckboxStyles

  screenTitle?: StyleProp<TextStyle>
  ticketHoldersTitle?: StyleProp<TextStyle>
  ticketHolderItemHeader?: StyleProp<TextStyle>

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
  skippingMessage?: string
  form?: {
    firstName?: string
    lastName?: string
    email?: string
    confirmEmail?: string
    password?: string
    confirmPassword?: string
    phone?: string
    street?: string
    city?: string
    country?: string
    state?: string
    zipCode?: string
    dateOfBirth?: string
    isSubToBrand?: string
    ticketHoldersTitle?: string
    ticketHolderItem?: string
    holderFirstName?: string
    holderLastName?: string
    holderEmail?: string
    holderPhone?: string
    getYourTicketsTitle?: string
    emailsAdvice?: string
    choosePassword?: string
    checkbox?: string
  }
}
