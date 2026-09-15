import { normalizePrices, PriceDataError } from './swap.utils'
import type { Token } from './swap.types'
import { createMockExchange } from './swap.mock'

export const submitSwap = createMockExchange(
  import.meta.env.DEV && import.meta.env.VITE_MOCK_SWAP_MODE === 'fail-once' ? 'fail-once' : 'success',
)

export const PRICES_URL = 'https://interview.switcheo.com/prices.json'
export const PRICE_TIMEOUT_MS = 10_000

export class PriceRequestError extends Error {
  constructor(message: string, public readonly retryable: boolean) { super(message) }
}

export async function fetchTokenPrices(signal?: AbortSignal): Promise<Token[]> {
  const controller = new AbortController()
  const onAbort = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', onAbort, { once: true })
  if (signal?.aborted) onAbort()
  let timedOut = false
  const timeout = setTimeout(() => { timedOut = true; controller.abort() }, PRICE_TIMEOUT_MS)
  try {
    const response = await fetch(PRICES_URL, { signal: controller.signal })
    if (!response.ok) throw new PriceRequestError('Prices could not be loaded. Please try again.', response.status >= 500 || response.status === 429)
    let data: unknown
    try { data = await response.json() } catch (error) {
      if (controller.signal.aborted) throw error
      throw new PriceDataError('The price service returned unreadable data.')
    }
    return normalizePrices(data)
  } catch (error) {
    if (signal?.aborted) throw error
    if (timedOut) throw new PriceRequestError('The price request timed out. Please try again.', true)
    if (error instanceof PriceDataError || error instanceof PriceRequestError) throw error
    throw new PriceRequestError('Could not connect to the price service. Check your connection and try again.', true)
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }
}

export function shouldRetryPrices(failureCount: number, error: Error): boolean {
  return failureCount < 1 && error instanceof PriceRequestError && error.retryable
}
