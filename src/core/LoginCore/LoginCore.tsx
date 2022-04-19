import React, { forwardRef, useImperativeHandle } from 'react'

import {
  authorize,
  fetchAccessToken,
  fetchUserProfile,
} from '../../api/ApiClient'
import { ILoginFields } from '../../components/login/types'
import { Config } from '../../helpers/Config'
import {
  deleteAllData,
  IStoredUserData,
  LocalStorageKeys,
  storeData,
} from '../../helpers/LocalStorage'
import { IUserProfilePublic } from '../../types'
import { ICoreProps } from '../CoreProps'
import { ILoginCoreResponse, LoginCoreHandle } from './LoginCoreTypes'

const LoginCore = forwardRef<LoginCoreHandle, ICoreProps>((props, ref) => {
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
        return {
          error: {
            ...authorizationError,
            extraData: { endpoint: 'authorize' },
          },
        }
      }

      if (!authorizationCode) {
        return {
          error: {
            message: 'There is no authorization code',
            extraData: { endpoint: 'authorize' },
          },
        }
      }

      await storeData(LocalStorageKeys.ACCESS_TOKEN, authorizationCode)

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
        return {
          error: {
            ...tokenError,
            extraData: {
              endpoint: 'accessToken',
            },
          },
        }
      }

      // Fetch user profile
      const { userProfileError, userProfileData } = await fetchUserProfile()

      if (userProfileError) {
        return {
          error: {
            ...userProfileError,
            extraData: {
              endpoint: 'userProfile',
            },
          },
        }
      }

      if (!userProfileData) {
        return {
          error: {
            message: 'There is no user profile',
            extraData: {
              endpoint: 'userProfile',
            },
          },
        }
      }

      const storedUserData: IStoredUserData = {
        id: userProfileData!.id,
        firstName: userProfileData!.firstName,
        lastName: userProfileData!.lastName,
        email: userProfileData!.email,
      }

      const userPublicData: IUserProfilePublic = {
        customerId: userProfileData.id,
        firstName: userProfileData.firstName,
        lastName: userProfileData.lastName,
        email: userProfileData.email,
        phone: userProfileData.phone,
        streetAddress: userProfileData.streetAddress,
        zipCode: userProfileData.zipCode,
        countryId: userProfileData.countryId,
        city: userProfileData.city,
        state: userProfileData.state,
        company: userProfileData.company,
        stateId: userProfileData.stateId,
      }

      await storeData(
        LocalStorageKeys.USER_DATA,
        JSON.stringify(storedUserData)
      )

      await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)

      return { data: userPublicData }
    },
    async logout() {
      await deleteAllData()
      return
    },
  }))

  return <>{props.children}</>
})

export default LoginCore
