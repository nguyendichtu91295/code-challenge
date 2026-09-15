import { useQuery } from '@tanstack/react-query'
import { fetchTokenPrices, shouldRetryPrices } from '../swap.api'

export function useTokenPrices() {
  return useQuery({
    queryKey: ['token-prices'],
    queryFn: ({ signal }) => fetchTokenPrices(signal),
    staleTime: 5 * 60_000,
    retry: shouldRetryPrices,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  })
}
