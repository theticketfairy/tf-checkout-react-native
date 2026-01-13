import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiResponse } from '../../api/api.types';
import { Client } from '../../api/ApiClient';
import { QueryOpts } from '../../common/query.types';
import { IEventCustomFields } from './types';

/**
 * Hook to fetch user profile
 */
export const useEventCustomFields = (
  eventId?: string,
  options?: QueryOpts<ApiResponse<IEventCustomFields>, AxiosError>
) => {
  const query = useQuery<ApiResponse<IEventCustomFields>, AxiosError>({
    queryKey: ['eventCustomFields', eventId],
    queryFn: () =>
      Client.get<ApiResponse<IEventCustomFields>>(
        `v1/event/${eventId}/custom_fields/`
      ).then((response) => response.data),
    retry: false,
    enabled: !!eventId,
    ...options,
  });

  return { ...query };
};
