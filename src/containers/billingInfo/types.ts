import {
  ColorValue,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IButtonStyles } from '../../components/button/types'
import { ICheckboxStyles } from '../../components/checkbox/types'
import { IDatePickerStyles } from '../../components/datePicker/types'
import { IDropdownStyles } from '../../components/dropdown/types'
import { IDropdownMaterialStyles } from '../../components/dropdownMaterial/types'
import { IInputStyles } from '../../components/input/types'
import {
  ILoginBrandImages,
  ILoginViewStyles,
  ILoginViewTexts,
} from '../../components/login/types'
import {
  IPhoneInputStyles,
  IPhoneInputTexts,
} from '../../components/phoneInput/types'
import { IError, ITicketsResponseData } from '../../types'

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
  cartProps: ITicketsResponseData

  // registerNewUser
  onRegisterSuccess?: (tokens: ITokens) => void
  onRegisterError?: (error: string) => void

  // checkoutOrder
  onCheckoutSuccess: (data: IOnCheckoutSuccess) => void
  onCheckoutError?: (error: IError) => void

  // login
  onLoginSuccess: (data: any) => void
  onLoginError?: (error: IError) => void

  //fetchUserProfile
  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileError?: (error: IError) => void

  //fetchCart
  onFetchCartError?: (error: IError) => void
  onFetchCartSuccess?: () => void

  // fetchCountries
  onFetchCountriesError?: (error: IError) => void
  onFetchCountriesSuccess?: () => void

  // fetchState
  onFetchStatesError?: (error: IError) => void
  onFetchStatesSuccess?: () => void

  // fetch Token
  onFetchAccessTokenError?: (error: IError) => void
  onFetchAccessTokenSuccess?: () => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  // Configure the skipping component, visible when isBillingRequired is false
  skipBillingConfig?: {
    styles?: {
      rootContainer?: StyleProp<ViewStyle>
      dialogContainer?: StyleProp<ViewStyle>
      brandImage?: StyleProp<ImageStyle>
      text?: StyleProp<TextStyle>
      activityIndicator?: {
        color?: ColorValue
        size?: 'large' | 'small'
      }
    }
    brandImage?: ImageSourcePropType
    isActivityIndicatorVisible?: boolean
  }

  loginBrandImages?: ILoginBrandImages

  areLoadingIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
  onSkippingStatusChange?: (status: SkippingStatusType) => void
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
  dropdownMaterialStyles?: IDropdownMaterialStyles
  checkboxStyles?: ICheckboxStyles

  screenTitle?: StyleProp<TextStyle>
  ticketHoldersTitle?: StyleProp<TextStyle>
  ticketHolderItemHeader?: StyleProp<TextStyle>

  texts?: StyleProp<TextStyle>
  customCheckbox?: ICheckboxStyles

  datePicker?: IDatePickerStyles

  privacyPolicyLinkStyle?: StyleProp<TextStyle>

  phoneInput?: IPhoneInputStyles
}

export interface IBillingInfoViewTexts {
  loginTexts?: ILoginViewTexts
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
    isSubToTicketFairy?: string
    privacyPolicy?: string
    ticketHoldersTitle?: string
    ticketHolderItem?: string
    holderFirstName?: string
    holderLastName?: string
    holderEmail?: string
    holderPhone?: string
    getYourTicketsTitle?: string
    emailsAdvice?: string
    choosePassword?: string
    fillAllRequiredFieldsAlert?: string
    optional?: string
    phoneInput?: IPhoneInputTexts
  }
}

export type SkippingStatusType =
  | 'skipping'
  | 'fail'
  | 'success'
  | 'false'
  | undefined
