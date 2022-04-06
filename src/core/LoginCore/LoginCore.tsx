import React, { forwardRef, useImperativeHandle } from 'react'

import {
  authorize,
  fetchAccessToken,
  fetchUserProfile,
} from '../../api/ApiClient'
import { ILoginFields } from '../../components/login/types'
import { Config } from '../../helpers/Config'
import {
  IStoredUserData,
  LocalStorageKeys,
  storeData,
} from '../../helpers/LocalStorage'
import { IUserProfilePublic } from '../../types'
import { ICoreProps } from '../CoreProps'
import { ILoginCoreResponse } from './LoginCoreTypes'

const LoginCore = forwardRef<void, ICoreProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    async login({
      email,
      password,
    }: ILoginFields): Promise<ILoginCoreResponse> {
      const bodyFormData = new FormData()
      bodyFormData.append('email', email)
      bodyFormData.append('password', password)

      const { code: authorizationCode, error: authorizationError } =
        await authorize(bodyFormData)

      if (authorizationError) {
        return { error: authorizationError }
      }

      const bodyFormDataToken = new FormData()
      bodyFormDataToken.append('code', authorizationCode)
      bodyFormDataToken.append('scope', 'profile')
      bodyFormDataToken.append('grant_type', 'authorization_code')
      bodyFormDataToken.append('client_id', Config.CLIENT_ID)
      bodyFormDataToken.append('client_secret', Config.CLIENT_SECRET)

      const { error: tokenError, accessToken } = await fetchAccessToken(
        bodyFormDataToken
      )

      if (tokenError) {
        return { error: tokenError }
      }

      // Fetch user profile
      const { error: userProfileError, userProfile } = await fetchUserProfile(
        accessToken
      )

      if (userProfileError) {
        return { error: userProfileError }
      }

      if (!userProfile) {
        return {
          error: {
            message: 'There is no user profile',
          },
        }
      }

      const storedUserData: IStoredUserData = {
        id: userProfile!.id,
        firstName: userProfile!.firstName,
        lastName: userProfile!.lastName,
        email: userProfile!.email,
      }

      const userPublicData: IUserProfilePublic = {
        customerId: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        streetAddress: userProfile.streetAddress,
        zipCode: userProfile.zipCode,
        countryId: userProfile.countryId,
        city: userProfile.city,
        state: userProfile.state,
        company: userProfile.company,
        stateId: userProfile.stateId,
      }

      await storeData(
        LocalStorageKeys.USER_DATA,
        JSON.stringify(storedUserData)
      )

      await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)

      return { data: userPublicData }
    },
  }))

  return <>{props.children}</>
})

export default LoginCore
