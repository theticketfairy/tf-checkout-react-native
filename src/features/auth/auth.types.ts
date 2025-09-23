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
