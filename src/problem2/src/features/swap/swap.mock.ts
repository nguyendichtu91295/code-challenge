import type { SwapRequest, SwapResult } from './swap.types'

export const SWAP_DELAY_MS = 1000

export function createMockExchange(mode: 'success' | 'fail-once' = 'success') {
  let shouldFail = mode === 'fail-once'
  return async (request: SwapRequest): Promise<SwapResult> => {
    const snapshot = { ...request }
    const { fromSymbol, toSymbol, sendAmount, receiveAmount, rate } = snapshot
    if (!fromSymbol.trim() || !toSymbol.trim() || fromSymbol === toSymbol ||
      ![sendAmount, receiveAmount, rate].every(value => Number.isFinite(value) && value > 0) ||
      Math.abs(sendAmount * rate - receiveAmount) > Math.max(Number.MIN_VALUE, receiveAmount * 1e-12)) {
      throw new Error('This quote is invalid. Check your amount and token pair.')
    }
    const failThisRequest = shouldFail
    shouldFail = false
    await new Promise(resolve => setTimeout(resolve, SWAP_DELAY_MS))
    if (failThisRequest) throw new Error('The demo swap could not be completed. Please try again.')
    return { ...snapshot, demo: true }
  }
}
