/**
 * Type definitions for checkout API interactions
 */

// API response wrapper type
export interface ApiResponse<T> {
  data: T
  success: boolean
  error: boolean
  message: string
  status: number
}

// Error response format
export interface ErrorResponse {
  error: {
    code: number
    message: string
    extraData?: any
  }
  success: false
  status: number
}

/**
 * Event-related types
 */
export interface EventAttributes {
  name: string
  description: string | null
  shortDescription: string | null
  slug: string
  country: string
  date: string
  startDate: string
  endDate: string
  ticketsSold: number
  timezone: string
  currency: {
    currency: string
    decimal_places: number
    symbol: string
  }
  formattedDate: string
  venueCountry: string
  venueCity: string
  venueState: string
  hideVenueUntil: string | null
  hideVenue: boolean
  venueName: string
  venueGooglePlaceId: string
  venueLatitude: string
  venueLongitude: string
  venuePostalCode: string | null
  venueStreet: string | null
  venueStreetNumber: string | null
  eventType: {
    festival: boolean
  }
  productImage: string
  imageUrl: string
  imageUrlHd: string
  backgroundImage: string
  salesStart: string | null
  salesEnd: string
  salesStarted: boolean
  salesEnded: boolean
  feeMode: string
  feesIncluded: boolean | null
  minimumAge: number | null
  passwordProtected: boolean
  passwordAuthenticated: boolean
}

export interface EventResponse {
  attributes: EventAttributes
  relationships: any[]
  type: string
}

/**
 * Ticket-related types
 */
export interface TicketInfo {
  id: string
  displayName: string
  optionName: string
  optionValue: string
  isTable: boolean
  feeIncluded: boolean
  price: number
  basePrice: number
  chosen: boolean
  priceCurrency: string
  priceSymbol: string
  taxesIncluded: boolean
  taxName: string
  minQuantity: number
  maxQuantity: number
  multiplier: number
  tags: string[]
  allowMultiplePurchases: boolean
  priceReplacementText: string
  waitingListEnabled: number
  waitingListMaxQuantity: number
  soldOut: number
  soldOutMessage: number
  totalStock: number
  hasEnded: boolean
  sortOrder: number
  displayTicket: boolean
  salesEnded: boolean
  salesStarted: boolean
}

export interface TicketsResponse {
  data: {
    attributes: {
      tickets: {
        [ticketId: string]: TicketInfo
      }
      showWaitingList: boolean
      is_access_code: boolean
      isPromotionsEnabled: boolean
      showTablePricePerGuest: boolean
      ValidPromoCode: boolean
      PromoCodeValidationMessage: string
    }
    relationships: any[]
    type: string
  }
}

/**
 * Cart and Add to Cart related types
 */
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

export interface CartData {
  eventId: string
  cart: Array<{
    id: string
    price: number
    quantity: number
  }>
  ttf_opt_in: number
  optedIn: number
  ttfOptIn: number
  hide_ttf_opt_in: boolean
  expiresAt: number
  is_table: boolean
}

export interface CartResponse {
  attributes: CartData
  relationships: any[]
  type: string
}

export interface AddToCartResponse {
  success: boolean
  status: number
  message: string
}

/**
 * Customer profile related types
 */
export interface TicketHolder {
  firstName: string
  lastName: string
  phone: string | null
  email: string
}

export interface CustomerProfileResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  streetAddress: string
  zipCode: string
  countryId: string
  company: string | null
  stateId: string
  city: string
  username: string
  screenName: string | null
  bio: string | null
  shortBio: string | null
  region: string | null
  image: string | null
  recommendedEvents: any[]
  rnRoles: any[]
  hasDashboardAccess: boolean
  ticketHolders: TicketHolder[]
  dateOfBirth: string | null
}

/**
 * Countries and states related types
 */
export interface CountryInfo {
  id: string
  code: string
  name: string
}

export interface StateInfo {
  label: string
  value: number
}

export type CountriesResponse = CountryInfo[]

export type StatesResponse = StateInfo[]

/**
 * Checkout related types
 */
export interface CheckoutResponse {
  attributes: {
    debt: string
    guest_count: null
    hash: string
    id: string
    pay_now: string
    status: string
    total: string
  }
}

export interface TicketPriceBreakdown {
  price: number
  name: string
  quantity: number
}

// Define the add-on price breakdown structure
export interface AddonPriceBreakdown {
  add_on_name: string
  quantity: number
  price_per_add_on: string
  cost_per_add_on: string
  total_price: number
  show_price: boolean
}

export interface CartPriceBreakdown {
  total: number
  total_add_ons: number
  currency: {
    code: string
    symbol: string
  }
  event_name: string
  goods_tax?: number
  goods_tax_name?: string
  tickets_price_breakdown: TicketPriceBreakdown[]
  add_ons_price_breakdown?: AddonPriceBreakdown[]
}

export interface UpdateCheckoutResponse {
  attributes: {
    cart_price_breakdown: CartPriceBreakdown
  }
}

export interface UpdateCheckoutParams {
  attributes: {
    event_id: number | string
    add_ons: {
      [key: string]: number
    }
    is_from_resale: boolean
  }
}

/**
 * Payment related types
 */
export interface TicketDetails {
  name: string
  quantity: number
  price: number
  cost: number
}

export interface OrderDetails {
  id: string
  total: number
  subtotal: number
  fees: number
  pay_now: number
  tickets: TicketDetails[]
  add_ons: any[]
  currency: string
  guest_count?: number
  debt?: number | null
}

export interface PaymentMethodDetails {
  stripe_client_secret?: string
  stripe_publishable_key?: string
  stripe_connected_account?: string
}

export interface PaymentDataResponse {
  attributes: {
    order_details: OrderDetails
    cart: Array<{
      product_name: string
    }>
    payment_method: PaymentMethodDetails
  }
}

export interface PaymentSuccessResponse {
  success: boolean
}

/**
 * User registration related types
 */
export interface RegisterUserResponse {
  attributes: {
    access_token: string
    refresh_token: string
    token_type: string
    scope: string
    user_profile: {
      first_name: string
      last_name: string
      email: string
      // date_of_birth: string | null
      phone: string | null
    }
  }
}

export interface UserRegistrationData {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirmation: string
  phone?: string
  city?: string
  street_address?: string
  zip?: string
  country?: number
  state?: number
}

/**
 * Add-ons related types
 */
export interface AddonItem {
  // id: string
  // name: string
  // description: string
  // price: number
  // image: string | null
  // quantity: number
  // max_quantity: number
  id: string
  type: 'add_on'
  attributes: {
    id: string
    name: string
    description: string | null
    image: string | null
    currency: string
    price: number
    faceValue: number
    feeIncluded: boolean
    cost: number
    groupName: string | null
    groupSortOrder: string | null
    level: string
    stock: number
    flagLimitToTicketQuantity: boolean
    limitPerTicket: string
    active: boolean
    type: string | null
    prerequisiteTicketTypeIds: string | null
    equivalentTicketTypeId: string | null
    withholdFromResale: boolean
    sortOrder: string
    maxQuantity: string
    addOnGroupId: string | null
    imageUrl: string | null
    hasSales: boolean
    currencies: []
  }
}

export interface AddonsResponse {
  attributes: {
    add_ons: AddonItem[]
  }
  relationships: any[]
  type: string
}

/**
 * Form data types for API requests
 */
export interface CheckoutFormValues {
  firstName: string
  lastName: string
  email: string
  emailConfirmation?: string
  phone?: string
  street: string
  city: string
  postalCode: string
  dateOfBirth?: Date
  password?: string
  passwordConfirmation?: string
  isSubToTicketFairy?: boolean
  isSubToBrand?: boolean
}

/**
 * API helper types
 */
export interface DropdownItem {
  value: string
  label: string
  code?: string
}

/**
 * Status types for checkout flow
 */
export type CheckoutStatus =
  | 'idle'
  | 'validating'
  | 'creating'
  | 'fetching'
  | 'confirming'
  | 'success'
  | 'failed'

/**
 * Response data types
 */
export interface OrderResult {
  orderHash: string
  total: number
  currency?: string
  email?: string
  paymentIntentId?: string
}

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
    add_ons?: Record<string, number>
  }
}
