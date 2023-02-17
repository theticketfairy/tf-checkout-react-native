import {
  ColorValue,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import {
  IRegisterNewUserError,
  IRegisterNewUserSuccessData,
} from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import {
  ICartTimerStyles,
  ICartTimerTexts,
} from '../../components/cartTimer/types'
import { ICheckboxStyles } from '../../components/checkbox/types'
import { IDatePickerStyles } from '../../components/datePicker/types'
import { IDropdownStyles } from '../../components/dropdown/types'
import { IDropdownMaterialStyles } from '../../components/dropdownMaterial/types'
import { IInputStyles } from '../../components/input/types'
import {
  ILoginBrandImages,
  ILoginSuccessData,
  ILoginViewStyles,
  ILoginViewTexts,
} from '../../components/login/types'
import {
  IPhoneInputStyles,
  IPhoneInputTexts,
} from '../../components/phoneInput/types'
import { IError, ITicketsResponseData } from '../../types'
import { IAddOnResponse } from '../../types/IAddOn'

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
  onRegisterSuccess?: (data: IRegisterNewUserSuccessData) => void
  onRegisterError?: (error: IRegisterNewUserError) => void

  // checkoutOrder
  onCheckoutSuccess: (data: IOnCheckoutSuccess) => void
  onCheckoutError?: (error: IError) => void

  // login
  onLoginSuccess: (data: ILoginSuccessData) => void
  onLoginError?: (error: IError) => void

  // logout
  onLogoutSuccess?: () => void
  onLogoutError?: (error: IError) => void

  // fetchUserProfile
  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileError?: (error: IError) => void

  // fetchCart
  onFetchCartError?: (error: IError) => void
  onFetchCartSuccess?: () => void

  // fetchCountries
  onFetchCountriesError?: (error: IError) => void
  onFetchCountriesSuccess?: () => void

  // fetchState
  onFetchStatesError?: (error: IError) => void
  onFetchStatesSuccess?: () => void

  // cartExpired
  onCartExpired: () => void

  // addOns
  onFetchAddonsError?: (error: IError) => void
  onFetchAddonsSuccess?: (data: IAddOnResponse[]) => void

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

  shouldCartTimerNotMinimizeOnTap?: boolean
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

  cartTimer?: ICartTimerStyles
}

export interface IBillingInfoViewTexts {
  loginTexts?: ILoginViewTexts
  checkoutButton?: string
  skippingMessage?: string
  invalidPhoneNumberError?: string
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
    ttfPrivacyPolicyRequiredError?: string
  }
  cartTimer?: ICartTimerTexts
}

export type SkippingStatusType =
  | 'skipping'
  | 'fail'
  | 'success'
  | 'false'
  | undefined
