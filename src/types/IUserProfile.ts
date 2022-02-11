export interface IUserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  streetAddress: string
  zipCode: string
  countryId: string
  company?: string
  state: string
  stateId: string
  city: string
  username: string
  screenName?: string
  bio?: string
  shortBio?: string
  region?: string
  image?: string
  recommendedEvents: []
  rnRoles: []
  hasDashboardAccess: boolean
  ticketHolders: []
}
