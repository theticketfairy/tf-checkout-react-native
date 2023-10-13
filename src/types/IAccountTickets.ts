import type { IError } from './IError'

export interface IAccountOrdersPurchasedEvent {
  url_name: string
  event_name: string
}

export interface IAccountOrdersTicket {
  id: string
  orderId: string
  hash: string
  qrData: string
  ticketType: string
  ticketTypeHash: string
  description?: any
  descriptionPlain?: any
  currency: string
  price: string
  retainAmountOnSale: number
  status: string
  holderName: string
  holderEmail?: any
  holderPhone?: any
  isTable: boolean
  isSellable: boolean
  isOnSale: boolean
  createdAt: Date
  pdfLink: string
  eventId: string
  eventName: string
  eventUrl: string
  eventTimezone: string
  eventStartDate: Date
  eventEndDate: Date
  eventSalesStartDate?: any
  eventSalesEndDate: Date
  eventImage: string
  eventBackgroundImage: string
  eventIsOnlineEvent: boolean
  venueCountry: string
  venueCity: string
  venueState: string
  hideVenueUntil?: any
  hideVenue: boolean
  venueName?: string //Optional
  venueGooglePlaceId?: string //Optional
  venueLatitude?: string //Optional
  venueLongitude?: string //Optional
  venuePostalCode?: string //Optional
  venueStreet?: string //Optional
  venueStreetNumber?: string //Optional
}

export interface IAccountTicketsAttributes {
  page: number
  limit: number
  total_count: number
  total_pages: number
  filter?: any
  brand_filter: string
  sub_brands: boolean
  purchased_events: IAccountOrdersPurchasedEvent[]
  tickets: IAccountOrdersTicket[]
}

export interface IAccountTicketsData {
  attributes: IAccountTicketsAttributes
  relationships: any[]
  type: string
}

export interface IAccountTicketsResponse {
  data?: IAccountTicketsData
  error?: IError
}
