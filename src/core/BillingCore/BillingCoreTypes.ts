import { IOnCheckoutSuccess } from '../..'
import {
  ICartResponse,
  ICheckoutBody,
  ICountriesResponse,
  IFetchAddOnsResponse,
  IRegisterNewUserResponse,
  IStatesResponse,
  IUserProfileResponse,
} from '../../api/types'
import { IError } from '../../types'
import { ICoreProps } from '../CoreProps'

export interface ICheckoutResponse {
  error?: IError
  data?: IOnCheckoutSuccess
}

export type BillingCoreHandle = {
  checkoutOrder(body: ICheckoutBody): Promise<ICheckoutResponse>
  getCart(): Promise<ICartResponse>
  getCountries(): Promise<ICountriesResponse>
  getStates(countryId: string): Promise<IStatesResponse>
  getUserProfile(): Promise<IUserProfileResponse>
  registerNewUser(data: FormData): Promise<IRegisterNewUserResponse>
  getAddOns(): Promise<IFetchAddOnsResponse>
}

export interface IBillingCoreProps extends ICoreProps {
  onCartExpired: () => void
  onSecondsLeftChange?: (secondsLeft: number) => void
}
