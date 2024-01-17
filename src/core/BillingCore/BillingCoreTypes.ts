import { IOnCheckoutSuccess } from '../..'
import {
  ICartResponse,
  ICheckoutBody,
  ICountriesResponse,
  IRegisterNewUserResponse,
  IStatesResponse,
  IUserProfileResponse,
} from '../../api/types'
import { IError } from '../../types'
import { ICoreProps } from '../CoreProps'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export interface ICheckoutResponse {
  error?: IError
  data?: IOnCheckoutSuccess
}

export type BillingCoreHandleType = {
  checkoutOrder(body: ICheckoutBody): Promise<ICheckoutResponse>
  getCart(): Promise<ICartResponse>
  getCountries(): Promise<ICountriesResponse>
  getStates(countryId: string): Promise<IStatesResponse>
  getUserProfile(): Promise<IUserProfileResponse>
  registerNewUser(data: FormData): Promise<IRegisterNewUserResponse>
  stopCartTimer(): void
}

export type BillingCoreHandle = BillingCoreHandleType & SessionCoreHandleType

export interface IBillingCoreProps extends ICoreProps {
  onCartExpired: () => void
  onSecondsLeftChange?: (secondsLeft: number) => void
}
