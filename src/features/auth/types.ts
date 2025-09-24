export interface IRegisterUserResponse {
  attributes: IAuthAttributes
}

export interface IAuthUserData {
  first_name: string
  last_name: string
  email: string
  date_of_birth: string | null
  phone: string | null
}

export interface IAuthAttributes {
  access_token: string
  refresh_token: string
  token_type: string
  scope: string
  user_profile: IAuthUserData
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
