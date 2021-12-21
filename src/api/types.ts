import { AxiosInstance } from 'axios'

import { ITicket } from '../types'

export interface IClientRequest extends AxiosInstance {
  setGuestToken: (token: string) => void
  setAccessToken: (token: string) => void
}

export interface IPromoCodeResponse {
  isValid: boolean
  message: string
}

export interface IFetchTicketsResponse {
  tickets?: ITicket[]
  error?: any
  promoCodeResult?: IPromoCodeResponse
  isInWaitingList?: boolean
}

export interface IAuthorizeResponse {
  error?: string
  code?: string
}

export interface IAddToCartParams {
  eventId: number | string
  attributes: {
    alternative_view_id?: string | number
    product_cart_quantity: number
    product_options: {
      [optionName]: number | string
    }
    product_id: number
    ticket_types: {
      [ticketId]: {
        product_options: {
          [optionName]: number
          ticket_price: number
        }
        quantity: number
      }
    }
  }
}

// Checkout types
export interface ICheckoutTicketHolder {
  email: string
  first_name: string
  last_name: string
  phone: string
}

export interface ICheckoutBody {
  attributes: {
    brand_opt_in: boolean
    city: string
    confirm_email: string
    country: number
    email: string
    first_name: string
    last_name: string
    password: string
    phone: string
    state: number
    street_address: string
    ttf_opt_in: boolean
    zip: string
    ticket_holders: ICheckoutTicketHolder[]
    dob_day?: number
    dob_month?: number
    dob_year?: number
  }
}

// Register New User
export interface IRegisterNewUserResponse {
  error?: {
    isAlreadyRegistered?: boolean
    message?: string
    raw?: any
  }
  data?: {
    access_token: string
    refresh_token: string
    token_type: string
    scope: string
    user_profile: {
      first_name: string
      last_name: string
      email: string
    }
  }
}

// Billing information
export interface ICheckoutResponse {
  error: string
  data: any
}

// Checkout
export interface IPaymentConfig {
  id: string
  name: string
  stripeClientSecret: string
  stripeConnectedAccount?: string
  stripePublishableKey: string
}

export interface IPaymentAddress {
  city: string
  line1: string
  state: string
  postalCode: string
}

export interface IOrderReview {
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
  error?: string
  data?: IOrderReview
}
