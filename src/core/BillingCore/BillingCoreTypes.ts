import type { IOnCheckoutSuccess } from '../..'
import type {
  ICartResponse,
  ICheckoutBody,
  ICountriesResponse,
  IRegisterNewUserResponse,
  IStatesResponse,
  IUserProfileResponse,
} from '../../api/types'
import type { IError } from '../../types'
import type { ICoreProps } from '../CoreProps'
import type { SessionCoreHandleType } from '../Session/SessionCoreTypes'

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
}

export type BillingCoreHandle = BillingCoreHandleType & SessionCoreHandleType

export interface IBillingCoreProps extends ICoreProps {
  onCartExpired: () => void
  onSecondsLeftChange?: (secondsLeft: number) => void
}
