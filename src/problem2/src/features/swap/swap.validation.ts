import type { Quote, Result, Token } from './swap.types'

export function isEditableAmount(input: string): boolean {
  return /^\d*(?:[.,]\d*)?$/.test(input)
}

export function validateAmount(input: string): Result<number> {
  const normalized = input.trim().replace(',', '.')
  if (!normalized) return { error: 'Enter an amount to continue.' }
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
    return { error: 'Enter a positive number using a decimal point or comma.' }
  }
  const amount = Number(normalized)
  if (!Number.isFinite(amount)) return { error: 'This amount is too large. Try a smaller value.' }
  if (amount === 0 && /[1-9]/.test(normalized)) return { error: 'This amount is too small to calculate.' }
  if (amount <= 0) return { error: 'Enter an amount greater than zero.' }
  return { value: amount }
}

export function calculateQuote(amount: number, from: Token, to: Token): Result<Quote> {
  if (from.symbol === to.symbol) return { error: 'Choose two different tokens.' }
  if (![amount, from.price, to.price].every(value => Number.isFinite(value) && value > 0)) {
    return { error: 'A valid amount and prices are needed for this quote.' }
  }
  const rate = from.price / to.price
  const receiveAmount = amount * rate
  if (![rate, receiveAmount].every(value => Number.isFinite(value) && value > 0)) {
    return { error: 'This quote is outside the supported range. Try another amount or pair.' }
  }
  return { value: { rate, receiveAmount } }
}
