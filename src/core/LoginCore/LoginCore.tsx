import React, { forwardRef, useImperativeHandle } from 'react'

import {
  authorize,
  closeSession,
  fetchAccessToken,
  fetchUserProfile,
  requestResetPassword,
  requestRestorePassword,
} from '../../api/ApiClient'
import type {
  ICloseSessionResponse,
  IResetPasswordRequestData,
} from '../../api/types'
import type { ILoginFields } from '../../components/login/types'
import {
  IStoredUserData,
  LocalStorageKeys,
  storeData,
} from '../../helpers/LocalStorage'
import type { IUserProfilePublic } from '../../types'
import type { ICoreProps } from '../CoreProps'
import { getFetchAccessTokenBody } from './LoginCoreHelper'
import type { ILoginCoreResponse, LoginCoreHandle } from './LoginCoreTypes'

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

      const {
        code: authorizationCode,
        error: authorizationError,
      } = await authorize(bodyFormData)

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

      const { accessTokenError, accessTokenData } = await fetchAccessToken(
        getFetchAccessTokenBody(authorizationCode)
      )

      if (accessTokenError) {
        return {
          error: {
            ...accessTokenError,
            extraData: {
              endpoint: 'accessToken',
            },
          },
        }
      }

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
        dateOfBirth: userProfileData.dateOfBirth,
      }

      await storeData(
        LocalStorageKeys.USER_DATA,
        JSON.stringify(storedUserData)
      )

      return { userProfile: userPublicData, accessTokenData: accessTokenData }
    },
    // #endregion Login

    // #region Logout
    async logout(): Promise<ICloseSessionResponse> {
      return await closeSession()
    },
    // #endregion Logout

    // #region Restore Password
    async restorePassword(email: string) {
      const response = await requestRestorePassword(email)
      return response
    },
    // #endregion Restore Password

    // #region Reset Password
    async resetPassword(data: IResetPasswordRequestData) {
      const response = await requestResetPassword(data)
      return response
    },
    // #endregion Reset Password
  }))

  return <>{props.children}</>
})

export default LoginCore
