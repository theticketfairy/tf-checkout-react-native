import { AxiosInstance } from 'axios'

import { IOnCheckoutSuccess } from '..'
import { IError, IEvent, ITicket, IUserProfile } from '../types'
import { ICountry } from '../types/ICountry'

export interface IClientRequest extends AxiosInstance {
  removeAccessToken: () => void
  removeGuestToken: () => void
  setAccessToken: (token: string) => void
  setBaseUrl: (baseUrl: string) => void
  setContentType: (contentType: string) => void
  setDomain: (domain: string) => void
  setGuestToken: (token: string) => void
  setTimeOut: (timeOut: number) => void
}

//#region Tickets
export interface IPromoCodeResponse {
  isValid: boolean | number
  message: string
}

export interface IFetchTicketsResponse {
  error?: IError
  isAccessCodeRequired?: boolean
  isInWaitingList?: boolean
  promoCodeResult?: IPromoCodeResponse
  tickets?: ITicket[]
}

export interface IAuthorizeResponse {
  code?: string
  error?: IError
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
  addToWaitingListData?: {
    error: boolean
    message: string
    status: number
    success: boolean
  }
  addToWaitingListError?: IError
}

//#endregion

export interface IEventData {
  description?: string
  name: string
  slug: string
  title: string
}

// Event types
export interface IEventResponse {
  eventData?: IEvent
  eventError?: IError
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
  currency: string
  customerId: string
  id: string
  orderHash: string
  total: string
}

export interface IFreeRegistrationResponse {
  freeRegistrationData?: IFreeRegistrationData
  freeRegistrationError?: IError
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
    dob_day?: number
    dob_month?: number
    dob_year?: number
  }
}

export interface IRegisterNewUserProfileResponseData {
  email: string
  firstName: string
  lastName: string
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
  registerNewUserResponseData?: IRegisterNewUserSuccessData
  registerNewUserResponseError?: IRegisterNewUserError
}

// Billing information
export interface ICheckoutResponse {
  data?: IOnCheckoutSuccess
  error?: IError
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
  postalCode: string
  state: string
}

export interface IOrderReview {
  addressData: IPaymentAddress
  billingData: {
    firstName: string
    lastName: string
  }
  expiresAt: number
  paymentData: IPaymentConfig
  reviewData: {
    event: string
    price: string
    ticketType: string
    total: string
    numberOfTickets: string
    currency: string
  }
}

export interface IOrderReviewResponse {
  orderReviewData?: IOrderReview
  orderReviewError?: IError
}

//#region MyOrders
export interface IMyOrdersEvent {
  event_name: string
  url_name: string
}

export interface IMyOrdersOrder {
  amount: string
  currency: string
  date: string
  eventEndDate: string
  eventId: string
  eventName: string
  eventSalesEndDate: string
  eventSalesStartDate: string | null
  eventStartDate: string
  eventUrl: string
  hideVenue: boolean
  hideVenueUntil: string | null
  id: string
  image: string
  timezone: string
  venueCity: string
  venueCountry: string
  venueGooglePlaceId?: string
  venueLatitude?: string
  venueLongitude?: string
  venueName?: string
  venuePostalCode?: string
  venueState: string
  venueStreet?: string
  venueStreetNumber?: string
}
export interface IMyOrdersData {
  brandFilter?: string
  events: IMyOrdersEvent[]
  filter?: string
  orders: IMyOrdersOrder[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
  subBrands?: boolean
}

export interface IMyOrdersResponse {
  myOrdersData?: IMyOrdersData
  myOrdersError?: IError
}

export type MyOrderRequestFromType =
  | 'upcoming_events'
  | 'ongoing_and_upcoming_events'
  | 'ongoing_events'
  | 'past_events'
  | ''

export interface IMyOrdersRequestParams {
  page: number
  limit?: number
  filter?: string
  from?: MyOrderRequestFromType
}
//#endregion

//#region My Order Details
export interface IMyOrderDetailsItem {
  currency: string
  discount: string
  hash: string
  isActive: boolean
  name: string
  price: string
  quantity: string
  total: string
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
  isTable: boolean
  pdfLink: string
  qrData: string
  resaleFeeAmount: number
  status: string
  ticketType: string
  ticketTypeHash: string
}

export interface IMyOrderDetailsHeader {
  currency: string
  date: string
  eventEndDate: string
  eventId: string
  eventName: string
  eventSalesEndDate: string
  eventSalesStartDate: string
  eventStartDate: string
  eventUrl: string
  hideVenueUntil: string | null
  id: string
  image: string
  isReferralDisabled: boolean
  isVenueHidden: boolean
  salesReferred: string
  shareLink: string
  timeZone: string
  total: string
  venue: {
    city: string
    country: string
    googlePlaceId?: string
    latitude?: string
    longitude?: string
    name?: string
    postalCode?: string
    state: string
    street?: string
    streetNumber?: string
  }
}

export interface IMyOrderDetailsData {
  header: IMyOrderDetailsHeader
  items?: IMyOrderDetailsItem[]
  tickets: IMyOrderDetailsTicket[]
}

export interface IMyOrderDetailsResponse {
  orderDetailsData?: IMyOrderDetailsData
  orderDetailsError?: IError
}
//#endregion

export interface ICartData {
  expiresAt: number
  isMarketingOptedIn: boolean // Brand
  isTfOptIn: boolean // Ticket fairy
  isTfOptInHidden?: boolean
  quantity: number
}

export interface ICartResponse {
  cartData?: ICartData
  cartError?: IError
}

export interface ICountriesResponse {
  countriesData?: ICountry[]
  countriesError?: IError
}

export interface IStateData {
  [key: number | string]: string
}

export interface IStatesResponse {
  statesData?: IStateData
  statesError?: IError
}

export interface IUserProfileResponse {
  userProfileData?: IUserProfile
  userProfileError?: IError
}

export interface IPurchaseConfirmationData {
  conversionPixels?: any
  currency: { currency: string; decimalPlaces: number; symbol: string }
  customConfirmationPageText?: string
  customerId: string
  eventDate: string
  eventDescription: string
  eventType: string
  isReferralDisabled: boolean
  message: string
  orderTotal: number
  personalShareLink: string
  personalShareSales: {
    price: number
    sales: number
  }[]
  productId: string
  productImage: string
  productName: string
  productPrice: number
  productUrl: string
  twitterHashtag?: string
}

export interface IPurchaseConfirmationResponse {
  purchaseConfirmationData?: IPurchaseConfirmationData
  purchaseConfirmationError?: IError
}

export interface IResaleTicketData {
  message: string
}

export interface IResaleTicketResponse {
  resaleTicketData?: IResaleTicketData
  resaleTicketError?: IError
}

export interface IRemoveTicketFromResaleData {
  message: string
}

export interface IRemoveTicketFromResaleResponse {
  removeTicketFromResaleData?: IRemoveTicketFromResaleData
  removeTicketFromResaleError?: IError
}

export interface IPostReferralData {
  message: string
  status: number
}

export interface IPostReferralResponse {
  postReferralData?: IPostReferralData
  postReferralError?: IError
}

export interface ICloseSessionData {
  message: string
}

export interface ICloseSessionResponse {
  closeSessionData?: ICloseSessionData
  closeSessionError?: IError
}

export interface IResetPasswordRequestData {
  password: string
  password_confirmation: string
  token: string
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
  scope: string
  tokenType: string
}

export interface IFetchAccessTokenResponse {
  accessTokenData?: IFetchAccessTokenData
  accessTokenError?: IError
}
//#endregion Refresh AccessToken
