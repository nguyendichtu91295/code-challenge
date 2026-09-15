import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockExchange, SWAP_DELAY_MS } from './swap.mock'

const request = { fromSymbol: 'ETH', toSymbol: 'USDC', sendAmount: 0.5, receiveAmount: 1000, rate: 2000 }
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('mock exchange', () => {
  it('resolves after the delay with an immutable submission snapshot', async () => {
    const input = { ...request }
    const result = createMockExchange()(input)
    input.sendAmount = 99
    let resolved = false
    void result.then(() => { resolved = true })
    await vi.advanceTimersByTimeAsync(SWAP_DELAY_MS - 1)
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(await result).toEqual({ ...request, demo: true })
  })
  it('fails the first valid request once and lets the user retry', async () => {
    const submit = createMockExchange('fail-once')
    await expect(submit({ ...request, sendAmount: 0 })).rejects.toThrow('invalid')
    const failure = expect(submit(request)).rejects.toThrow('could not be completed')
    await vi.runAllTimersAsync()
    await failure
    const success = submit(request)
    await vi.runAllTimersAsync()
    expect(await success).toEqual({ ...request, demo: true })
  })
  it.each([{ ...request, fromSymbol: '' }, { ...request, toSymbol: 'ETH' },
    { ...request, rate: Infinity }, { ...request, receiveAmount: 1001 }, { ...request, sendAmount: -1 }])('rejects invalid request %j', async input => {
    await expect(createMockExchange()(input)).rejects.toThrow('invalid')
    expect(vi.getTimerCount()).toBe(0)
  })
})
