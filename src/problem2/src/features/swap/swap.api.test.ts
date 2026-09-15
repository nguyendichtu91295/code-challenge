import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTokenPrices, PRICE_TIMEOUT_MS, PriceRequestError, shouldRetryPrices } from './swap.api'
import { PriceDataError } from './swap.utils'

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

describe('price requests', () => {
  it('fetches and normalizes a response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { currency: 'ETH', price: 2000, date: '2023-08-29' },
    ]))))
    expect(await fetchTokenPrices()).toEqual([{ symbol: 'ETH', price: 2000, date: '2023-08-29T00:00:00.000Z' }])
  })
  it.each([500, 429, 404])('classifies HTTP %i', async status => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status })))
    const error = await fetchTokenPrices().catch(error => error as Error)
    expect(error).toBeInstanceOf(PriceRequestError)
    if (!(error instanceof Error)) throw new Error('Expected request rejection')
    expect(shouldRetryPrices(0, error)).toBe(status !== 404)
    expect(shouldRetryPrices(1, error)).toBe(false)
  })
  it('does not retry unreadable or malformed data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not json')))
    await expect(fetchTokenPrices()).rejects.toBeInstanceOf(PriceDataError)
    expect(shouldRetryPrices(0, new PriceDataError('bad'))).toBe(false)
  })
  it('aborts timed-out requests', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))
    const result = expect(fetchTokenPrices()).rejects.toThrow('timed out')
    await vi.advanceTimersByTimeAsync(PRICE_TIMEOUT_MS)
    await result
  })
  it('propagates caller cancellation and clears timeout', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))
    const controller = new AbortController()
    const result = expect(fetchTokenPrices(controller.signal)).rejects.toThrow('Aborted')
    controller.abort()
    await result
    expect(vi.getTimerCount()).toBe(0)
  })
})
