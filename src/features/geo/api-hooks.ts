import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiResponse } from '../../api/api.types'
import { Client } from '../../api/ApiClient'
import { CountriesResponse, StatesResponse } from './types'

/**
 * Hook to fetch countries list
 */
export const useCountries = () => {
  return useQuery<ApiResponse<CountriesResponse>, AxiosError>({
    queryKey: ['countries'],
    queryFn: () =>
      Client.get<ApiResponse<CountriesResponse>>(`countries/list`).then(
        (response) => response.data
      ),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - countries rarely change
  })
}

/**
 * Hook to fetch states for a country
 */
export const useStates = (countryId?: string) => {
  return useQuery<ApiResponse<StatesResponse>, AxiosError>({
    queryKey: ['states', countryId],
    queryFn: () =>
      Client.get<ApiResponse<Record<string, string>>>(
        `countries/${countryId}/states/`
      ).then((response) => {
        return {
          ...response.data,
          data: Object.entries(response.data.data || {}).map(([id, name]) => ({
            label: String(name),
            value: parseInt(String(id), 10),
          })),
        }
      }),
    enabled: !!countryId && countryId !== '-1',
  })
}
