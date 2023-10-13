import type { IDropdownItem } from '../components/dropdown/types'
import type { TicketsType } from '../core/TicketsCore/TicketsCoreTypes'
import type { IError } from './IError'

export interface ITicket {
  sortOrder: number
  displayTicket?: boolean
  salesEnded: boolean
  salesStarted: boolean
  id: string
  displayName: string
  optionName: string
  optionValue: string
  isTable: string
  feeIncluded: boolean
  price: number
  basePrice: number
  chosen: number
  priceCurrency: string
  priceSymbol: string
  taxesIncluded: boolean
  taxName: string
  minQuantity: number
  maxQuantity: number
  multiplier: number
  tags: []
  allowMultiplePurchases: number
  priceReplacementText: string
  waitingListEnabled: boolean
  soldOut?: boolean
  soldOutMessage: string
  minGuests?: number
  maxGuests?: number
  buyButtonText?: string
  totalStock: number
  guestPrice?: number
  alwaysAvailable: string
  feeText: string
  x_face_value: number
  sold_out?: boolean
  oldPrice?: number
  oldBasePrice?: number
  descriptionRich?: string
  groupName?: string
}

export interface ISelectedTicket extends ITicket {
  selectedOption?: IDropdownItem
}

export interface ITicketsResponseData {
  isBillingRequired: boolean
  isPhoneRequired?: boolean
  isAgeRequired?: boolean
  minimumAge?: number
  isNameRequired?: boolean
  isTicketFree?: boolean
  isPhoneHidden?: boolean
}

export interface IAddToCartResponse {
  error?: IError
  data?: ITicketsResponseData
}

export interface IOnFetchTicketsSuccess {
  tickets: TicketsType
  promoCodeResponse: {
    success?: boolean
    message?: string
  }
  isInWaitingList?: boolean
  isAccessCodeRequired?: boolean
  areTicketsGroupsShown?: boolean
  arePromoCodesEnabled?: boolean
}
