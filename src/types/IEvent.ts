export interface IEvent {
  affirmAllowed: boolean
  alwaysShowWaitingList?: any
  backgroundImage: string
  backgroundVideo?: string
  brandCheckoutPixels?: string
  brandConversionPixels?: string
  brandGoogleAnalyticsKey?: string
  brandPagePixels?: string
  checkoutPixels?: string
  conversionPixels?: string
  country: string
  currency: {
    currency: string
    decimal_places: number
    symbol: string
  }
  date: string
  description?: string
  descriptions: any
  enableWaitingList: boolean
  endDate: string
  eventType: any
  facebookEvent?: string
  faq: []
  feeMode: string
  feesIncluded?: any
  formattedDate: string
  fullTitleReplacement?: any
  hideTopInfluencers: boolean
  hideVenue?: boolean
  hideVenueUntil?: string
  imageUrl: string
  imageUrlHd: string
  imageURLs: any
  isTimeSlotEvent: boolean
  l10nLanguages: []
  minimumAge?: any
  name: string
  ogImage?: string
  pagePixels?: string
  passwordAuthenticated: boolean
  passwordProtected: boolean
  preregEnabled: boolean
  preregistered: []
  presalesEnded: boolean
  presalesStarted: boolean
  productImage: string
  redirectUrl?: string
  referrals: []
  referralsEnabled: boolean
  relatedProducts: []
  salesEnd: string
  salesEnded: boolean
  salesStart?: string
  salesStarted: boolean
  slug: string
  startDate: string
  subHeading?: any
  tableMapEnabled: boolean
  tags: []
  ticketsSold: number
  timezone: string
  title: string
  titleReplacementHeight?: any
  titleReplacementImage?: any
  titleReplacementImageSvg?: any
  twitterImage?: string
  venueCity?: string
  venueCountry: string
  venueGooglePlaceId?: string
  venueLatitude?: string
  venueLongitude?: string
  venueName?: string
  venuePostalCode?: string
  venueState?: string
  venueStreet?: string
  venueStreetNumber?: string
  waitingListMaxQuantity: number
}

export interface IEventData {
  description?: string
  name: string
  slug: string
  title: string
}
