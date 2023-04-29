export interface IUserProfilePublic {
  customerId: string
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
  dateOfBirth?: string
}

export interface IUserProfile extends IUserProfilePublic {
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
}
