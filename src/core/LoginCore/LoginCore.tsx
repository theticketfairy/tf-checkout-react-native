import React, { forwardRef, useImperativeHandle } from 'react'

import {
  authorize,
  closeSession,
  fetchAccessToken,
  fetchUserProfile,
  requestResetPassword,
  requestRestorePassword,
} from '../../api/ApiClient'
import { ICloseSessionResponse } from '../../api/types'
import { ILoginFields } from '../../components/login/types'
import { Config } from '../../helpers/Config'
import {
  IStoredUserData,
  LocalStorageKeys,
  storeData,
} from '../../helpers/LocalStorage'
import { IUserProfilePublic } from '../../types'
import { ICoreProps } from '../CoreProps'
import { ILoginCoreResponse, LoginCoreHandle } from './LoginCoreTypes'

const LoginCore = forwardRef<LoginCoreHandle, ICoreProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    // #region Login
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

      await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)

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
    async logout(): Promise<ICloseSessionResponse> {
      return await closeSession()
    },
    // #endregion

    // #region Restore Password
    async restorePassword(email: string) {
      const response = await requestRestorePassword(email)
      return response
    },
    // #endregion

    // #region Reset Password
    async resetPassword(data: any) {
      const response = await requestResetPassword(data)
      return response
    },
    // #endregion
  }))

  return <>{props.children}</>
})

export default LoginCore
