export type Address = {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country?: string
}

export type Customer = {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export type CheckoutPayload = {
  customer: Customer
  billing: Address
  shipping?: Address
}

export type ErrorMap = {
  form?: string
  fields?: Record<string, string>
}

export type CheckoutResult = {
  orderHash: string
  total: string
  currency: string
  email?: string
}

import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'
import { ICartTimerStyles, ICartTimerTexts } from '../cartTimer/types'
import { ICheckboxStyles } from '../checkbox/types'
import { IDatePickerStyles } from '../datePicker/types'
import { IDropdownStyles } from '../dropdown/types'
import { IDropdownMaterialStyles } from '../dropdownMaterial/types'
import { IInputStyles } from '../input/types'
import { ILoginViewStyles, ILoginViewTexts } from '../login/types'
import { IPhoneInputStyles, IPhoneInputTexts } from '../phoneInput/types'

// Import OrderReview types
export interface IOrderItem {
  id: string
  title: string
  value: string
  styles?: {
    title?: StyleProp<TextStyle>
    value?: StyleProp<TextStyle>
    container?: StyleProp<ViewStyle>
  }
}

export interface IOrderReviewProps {
  orderItems: IOrderItem[]
  styles?: {
    item?: {
      title?: StyleProp<TextStyle>
      value?: StyleProp<TextStyle>
      container?: StyleProp<ViewStyle>
    }
    rootContainer?: StyleProp<ViewStyle>
  }
}

interface IOrderItemStyles {
  title?: StyleProp<TextStyle>
  value?: StyleProp<TextStyle>
  container?: StyleProp<ViewStyle>
}

interface IOrderReviewStyles {
  item?: IOrderItemStyles
  rootContainer?: StyleProp<ViewStyle>
}

export interface ICheckoutSPTexts {
  loginTexts?: ILoginViewTexts
  checkoutButton?: string
  screenTitle?: string
  title?: string
  subTitle?: string
  passwordTitle?: string
  emailAdvice?: string
  paymentTitle?: string
  providePaymentInfo?: string
  addonMainTitle?: string
  addonSubTitle?: string
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
    phoneInput?: IPhoneInputTexts
    emailsAdvice?: string
    choosePassword?: string
    getYourTicketsTitle?: string
  }
  cartTimer?: ICartTimerTexts
}

export interface ICheckoutSPStyles {
  rootContainer?: StyleProp<ViewStyle>
  loginStyles?: ILoginViewStyles
  screenTitle?: StyleProp<TextStyle>
  title?: StyleProp<TextStyle>
  subTitle?: StyleProp<TextStyle>
  passwordTitle?: StyleProp<TextStyle>
  emailAdvice?: StyleProp<TextStyle>
  paymentTitle?: StyleProp<TextStyle>
  texts?: StyleProp<TextStyle>
  errorBanner?: StyleProp<ViewStyle>
  errorText?: StyleProp<TextStyle>

  // Form components
  inputStyles?: IInputStyles
  dropdownStyles?: IDropdownStyles
  dropdownMaterialStyles?: IDropdownMaterialStyles
  checkboxStyles?: ICheckboxStyles
  datePickerStyles?: IDatePickerStyles
  phoneInputStyles?: IPhoneInputStyles

  // Button
  checkoutButton?: IButtonStyles
  checkoutButtonDisabled?: IButtonStyles

  // Addons
  addonSection?: StyleProp<ViewStyle>
  addonMainTitle?: StyleProp<TextStyle>
  addonSubtitle?: StyleProp<TextStyle>
  addonItem?: StyleProp<ViewStyle>
  addonInfo?: StyleProp<ViewStyle>
  addonName?: StyleProp<TextStyle>
  addonPrice?: StyleProp<TextStyle>
  addonPriceWithFees?: StyleProp<TextStyle>
  addonDescription?: StyleProp<TextStyle>
  addonSelectContainer?: StyleProp<ViewStyle>

  // Order review
  orderReview?: IOrderReviewStyles

  // Payment section
  payment?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    cardContainer?: StyleProp<ViewStyle>
    cardStyle?: any
  }

  // Card style (legacy)
  cardStyle?: any

  // Cart timer
  cartTimer?: ICartTimerStyles
}
