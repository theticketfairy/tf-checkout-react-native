import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'

import { ApiResponse } from '../../api/api.types'
import { Client } from '../../api/ApiClient'
import {
  deleteData,
  getData,
  LocalStorageKeys,
} from '../../helpers/LocalStorage'
import { IRegisterUserResponse } from './auth.types'

/*
 * Hook to register new user
 */
export const useRegisterUser = () => {
  return useMutation<ApiResponse<IRegisterUserResponse>, AxiosError, FormData>({
    mutationFn: (userData) =>
      Client.post<ApiResponse<IRegisterUserResponse>>(
        'v1/oauth/register-rn',
        userData
      ).then((response) => response.data),
  })
}

export const useCheckToken = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  useEffect(() => {
    const checkToken = async () => {
      const token = await getData(LocalStorageKeys.ACCESS_TOKEN)
      if (!token) {
        setHasToken(false)
        return
      }

      const decodedToken = jwtDecode<{ exp: number }>(token)
      if (decodedToken && decodedToken.exp < Date.now() / 1000) {
        await deleteData(LocalStorageKeys.ACCESS_TOKEN)
        await deleteData(LocalStorageKeys.USER_DATA)
        return
      }
      setHasToken(!!token)
    }
    checkToken()
  }, [])

  return hasToken
}
