import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import {
  checkoutOrder,
  fetchCart,
  fetchCountries,
  fetchStates,
  fetchUserProfile,
  registerNewUser,
} from '../../api/ApiClient'
import {
  ICartResponse,
  ICheckoutBody,
  ICountriesResponse,
  IRegisterNewUserResponse,
  IStatesResponse,
  IUserProfileResponse,
} from '../../api/types'
import { ICoreProps } from '../CoreProps'
import { BillingCoreHandle, ICheckoutResponse } from './BillingCoreTypes'

const BillingCore = forwardRef<BillingCoreHandle, ICoreProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    async checkoutOrder(body: ICheckoutBody): Promise<ICheckoutResponse> {
      return await checkoutOrder(body)
    },

    async getCart(): Promise<ICartResponse> {
      return await fetchCart()
    },

    async getCountries(): Promise<ICountriesResponse> {
      return await fetchCountries()
    },

    async getStates(countryId: string): Promise<IStatesResponse> {
      return await fetchStates(countryId)
    },

    async getUserProfile(): Promise<IUserProfileResponse> {
      return await fetchUserProfile()
    },

    async registerNewUser(data: FormData): Promise<IRegisterNewUserResponse> {
      return await registerNewUser(data)
    },
  }))

  return <>{props.children}</>
})

export default BillingCore
