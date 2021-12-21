import { IDropdownItem } from '../components/dropdown/types'

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
}

export interface ISelectedTicket extends ITicket {
  selectedOption?: IDropdownItem
}
