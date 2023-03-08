import { AxiosInstance } from 'axios'

import { IOnCheckoutSuccess } from '..'
import { IError, IEvent, ITicket, IUserProfile } from '../types'
import { ICountry } from '../types/ICountry'

export interface IClientRequest extends AxiosInstance {
  setGuestToken: (token: string) => void
  setAccessToken: (token: string) => void
  setBaseUrl: (baseUrl: string) => void
  setTimeOut: (timeOut: number) => void
  setDomain: (domain: string) => void
  setContentType: (contentType: string) => void
  removeGuestToken: () => void
  removeAccessToken: () => void
}

//#region Tickets
export interface IPromoCodeResponse {
  isValid: boolean | number
  message: string
}

export interface IFetchTicketsResponse {
  tickets?: ITicket[]
  error?: IError
  promoCodeResult?: IPromoCodeResponse
  isInWaitingList?: boolean
  isAccessCodeRequired?: boolean
}

export interface IAuthorizeResponse {
  error?: IError
  code?: string
}

export interface IAddToCartParams {
  attributes: {
    alternative_view_id?: string | number | null
    product_cart_quantity: number
    product_options: {
      [key: string]: number | string
    }
    product_id: number
    ticket_types: {
      [key: string]: {
        product_options: {
          [key: string]: number | string
          ticket_price: number
        }
        quantity: number
      }
    }
  }
}
//#endregion

//#region WaitingList
export interface IAddToWaitingListResponse {
  addToWaitingListError?: IError
  addToWaitingListData?: {
    error: boolean
    message: string
    status: number
    success: boolean
  }
}

//#endregion

export interface IEventData {
  slug: string
  name: string
  description?: string
  title: string
}

// Event types
export interface IEventResponse {
  eventError?: IError
  eventData?: IEvent
}

//#region Checkout
export interface ICheckoutTicketHolder {
  email: string
  first_name: string
  last_name: string
  phone: string
}

export interface ICheckoutBody {
  attributes: {
    brand_opt_in: boolean
    city?: string
    confirm_email: string
    country?: number
    email: string
    first_name: string
    last_name: string
    password: string
    phone?: string
    state?: number
    street_address?: string
    ttf_opt_in: boolean
    zip?: string
    ticket_holders: ICheckoutTicketHolder[]
    dob_day?: number
    dob_month?: number
    dob_year?: number
  }
}

export interface IFreeRegistrationData {
  id: string
  customerId: string
  total: string
  currency: string
  orderHash: string
}

export interface IFreeRegistrationResponse {
  freeRegistrationError?: IError
  freeRegistrationData?: IFreeRegistrationData
}
//#endregion

// Register New User
export interface IRegisterNewUserBody {
  attributes: {
    email: string
    password: string
    password_confirmation: string
    first_name: string
    last_name: string
    client_id: string
    client_secret: string
    country?: number
    city?: string
    state?: number
    street_address?: string
    zip?: string
    phone?: string
    check_cart_expiration: boolean
  }
}

export interface IRegisterNewUserProfileResponseData {
  firstName: string
  lastName: string
  email: string
}

export interface IRegisterNewUserSuccessData {
  accessTokenData: IFetchAccessTokenData
  userProfile: IRegisterNewUserProfileResponseData
}

export interface IRegisterNewUserError {
  isAlreadyRegistered?: boolean
  message?: string
  raw?: any
}

export interface IRegisterNewUserResponse {
  registerNewUserResponseError?: IRegisterNewUserError
  registerNewUserResponseData?: IRegisterNewUserSuccessData
}

// Billing information
export interface ICheckoutResponse {
  error?: IError
  data?: IOnCheckoutSuccess
}

// Checkout
export interface IPaymentConfig {
  id: string
  name: string
  stripeClientSecret?: string
  stripeConnectedAccount?: string
  stripePublishableKey?: string
}

export interface IPaymentAddress {
  city: string
  line1: string
  state: string
  postalCode: string
}

export interface IOrderReview {
  expiresAt: number
  reviewData: {
    event: string
    price: string
    ticketType: string
    total: string
    numberOfTickets: string
    currency: string
  }
  paymentData: IPaymentConfig
  addressData: IPaymentAddress
  billingData: {
    firstName: string
    lastName: string
  }
}

export interface IOrderReviewResponse {
  orderReviewError?: IError
  orderReviewData?: IOrderReview
}

//#region MyOrders
export interface IMyOrdersEvent {
  url_name: string
  event_name: string
}

export interface IMyOrdersOrder {
  id: string
  date: string
  currency: string
  amount: string
  eventName: string
  eventUrl: string
  image: string
}
export interface IMyOrdersData {
  events: IMyOrdersEvent[]
  orders: IMyOrdersOrder[]
  filter?: string
  brandFilter?: string
  subBrands?: boolean
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

export interface IMyOrdersResponse {
  myOrdersData?: IMyOrdersData
  myOrdersError?: IError
}
//#endregion

//#region My Order Details
export interface IMyOrderDetailsItem {
  isActive: boolean
  currency: string
  discount: string
  name: string
  price: string
  quantity: string
  total: string
  hash: string
}

export interface IMyOrderDetailsTicket {
  currency: string
  description: string
  descriptionPlain?: string
  eventName: string
  hash: string
  holderEmail?: string
  holderName: string
  holderPhone?: string
  isOnSale: boolean
  isSellable: boolean
  pdfLink: string
  qrData: string
  resaleFeeAmount: number
  status: string
  ticketType: string
  ticketTypeHash: string
}

export interface IMyOrderDetailsHeader {
  isReferralDisabled: boolean
  shareLink: string
  total: string
  salesReferred: string
}

export interface IMyOrderDetailsData {
  header: IMyOrderDetailsHeader
  items?: IMyOrderDetailsItem[]
  tickets: IMyOrderDetailsTicket[]
}

export interface IMyOrderDetailsResponse {
  orderDetailsError?: IError
  orderDetailsData?: IMyOrderDetailsData
}
//#endregion

export interface ICartData {
  quantity: number
  isTfOptInHidden?: boolean
  isTfOptIn: boolean // Ticket fairy
  isMarketingOptedIn: boolean // Brand
  expiresAt: number
}

export interface ICartResponse {
  cartError?: IError
  cartData?: ICartData
}

export interface ICountriesResponse {
  countriesError?: IError
  countriesData?: ICountry[]
}

export interface IStateData {
  [key: number | string]: string
}

export interface IStatesResponse {
  statesError?: IError
  statesData?: IStateData
}

export interface IUserProfileResponse {
  userProfileError?: IError
  userProfileData?: IUserProfile
}

export interface IPurchaseConfirmationData {
  conversionPixels?: any
  currency: { currency: string; decimalPlaces: number; symbol: string }
  customConfirmationPageText?: string
  customerId: string
  isReferralDisabled: boolean
  eventDate: string
  eventDescription: string
  eventType: string
  message: string
  orderTotal: number
  personalShareLink: string
  productId: string
  productImage: string
  productName: string
  productPrice: number
  productUrl: string
  twitterHashtag?: string
  personalShareSales: {
    price: number
    sales: number
  }[]
}

export interface IPurchaseConfirmationResponse {
  purchaseConfirmationError?: IError
  purchaseConfirmationData?: IPurchaseConfirmationData
}

export interface IResaleTicketData {
  message: string
}

export interface IResaleTicketResponse {
  resaleTicketError?: IError
  resaleTicketData?: IResaleTicketData
}

export interface IRemoveTicketFromResaleData {
  message: string
}

export interface IRemoveTicketFromResaleResponse {
  removeTicketFromResaleError?: IError
  removeTicketFromResaleData?: IRemoveTicketFromResaleData
}

export interface IPostReferralData {
  message: string
  status: number
}

export interface IPostReferralResponse {
  postReferralError?: IError
  postReferralData?: IPostReferralData
}

export interface ICloseSessionData {
  message: string
}

export interface ICloseSessionResponse {
  closeSessionError?: IError
  closeSessionData?: ICloseSessionData
}

export interface IResetPasswordRequestData {
  token: string
  password: string
  password_confirmation: string
}

export interface IRestorePasswordData {
  message: string
  status?: number
}

export interface IRestorePasswordResponse {
  data?: IRestorePasswordData
  error?: IError
}

export interface IResetPasswordResponse extends IRestorePasswordResponse {}

//#region Fetch AccessToken
export interface IFetchAccessTokenData {
  accessToken: string
  refreshToken: string
  tokenType: string
  scope: string
}

export interface IFetchAccessTokenResponse {
  accessTokenError?: IError
  accessTokenData?: IFetchAccessTokenData
}
//#endregion Refresh AccessToken
