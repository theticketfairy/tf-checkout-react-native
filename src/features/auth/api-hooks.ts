import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { ApiResponse } from '../../api/api.types'
import { Client } from '../../api/ApiClient'
import { QueryOpts } from '../../common/query.types'
import { isStoredTokenValid } from '../../helpers/LocalStorage'
import { CustomerProfileResponse, IRegisterUserResponse } from './types'

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

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (
  options?: QueryOpts<ApiResponse<CustomerProfileResponse>, AxiosError>
) => {
  const queryClient = useQueryClient()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    isStoredTokenValid().then((isValid) => setEnabled(isValid))
  }, [])

  const invalidate = useCallback(async () => {
    const isValid = await isStoredTokenValid()
    setEnabled(isValid)
    queryClient.invalidateQueries({ queryKey: ['userProfile'] })

    if (!isValid) {
      queryClient.cancelQueries({ queryKey: ['userProfile'] })
      queryClient.removeQueries({ queryKey: ['userProfile'] })
      queryClient.setQueryData(['userProfile'], undefined)
    }
  }, [queryClient])

  const query = useQuery<ApiResponse<CustomerProfileResponse>, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () =>
      Client.get<ApiResponse<CustomerProfileResponse>>(
        `customer/profile/`
      ).then((response) => response.data),
    retry: false,
    enabled,
    ...options,
  })

  return { ...query, invalidate }
}
