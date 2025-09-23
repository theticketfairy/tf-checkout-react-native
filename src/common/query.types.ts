import type {
  QueryKey,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query'

export type QueryOpts<T, E> = Omit<
  UndefinedInitialDataOptions<T, E, T, QueryKey>,
  'queryKey' | 'queryFn'
>
