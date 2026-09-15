import { describe, expect, it } from 'vitest'
import { calculateQuote, validateAmount } from './swap.validation'
import { defaultPair, formatAmount, normalizePrices, tokenIconUrl } from './swap.utils'

const date = '2023-08-29T07:10:40.000Z'
const eth = { symbol: 'ETH', price: 2000, date }
const usdc = { symbol: 'USDC', price: 1, date }

describe('price normalization', () => {
  it('keeps newest records and uses the last valid equal-date record', () => {
    const tokens = normalizePrices([
      { currency: 'USDC', price: 0.99, date },
      { currency: 'USDC', price: 1, date: '2023-08-28' },
      { currency: 'USDC', price: 0.999, date },
      { currency: 'USDC', price: -1, date: '2023-08-30' },
      { currency: 'ETH', price: 2000, date },
    ])
    expect(tokens).toEqual([eth, { ...usdc, price: 0.999 }])
  })
  it('omits invalid records and preserves mixed-case symbols', () => {
    expect(normalizePrices([null, {}, { currency: '', date, price: 1 },
      { currency: 'A', date, price: Infinity }, { currency: 'B', date: 'bad', price: 2 },
      { currency: 'C', date, price: '1' }, { currency: 'D', date, price: 0 },
      { currency: 'bNEO', date, price: 7 }])).toEqual([{ symbol: 'bNEO', date, price: 7 }])
  })
  it('distinguishes malformed responses from empty/insufficient data', () => {
    expect(() => normalizePrices({})).toThrow('invalid response')
    expect(defaultPair(normalizePrices([]))).toEqual(['', ''])
    expect(defaultPair([eth])).toEqual(['ETH', ''])
    expect(defaultPair([usdc, eth])).toEqual(['ETH', 'USDC'])
  })
})

describe('amounts and quotes', () => {
  it.each(['', ' ', '0', '-1', '1e3', 'abc', '1,2,3', '1.2.3', '+1', 'Infinity'])('rejects %j', value => {
    expect(validateAmount(value).error).toBeTruthy()
  })
  it.each([['0.5', 0.5], ['.25', 0.25], ['1,5', 1.5], ['12.', 12], [' 2 ', 2]])('accepts %s', (input, value) => {
    expect(validateAmount(input).value).toBe(value)
  })
  it('rejects numeric overflow and underflow', () => {
    expect(validateAmount('9'.repeat(400)).error).toContain('large')
    expect(validateAmount('0.' + '0'.repeat(400) + '1').error).toContain('small')
  })
  it('converts in both directions without rounding internally', () => {
    expect(calculateQuote(0.5, eth, usdc).value).toEqual({ rate: 2000, receiveAmount: 1000 })
    expect(calculateQuote(1000, usdc, eth).value?.receiveAmount).toBeCloseTo(0.5)
    expect(calculateQuote(1 / 3, eth, usdc).value?.receiveAmount).toBeCloseTo(2000 / 3)
  })
  it('rejects identical tokens, invalid prices and unrepresentable results', () => {
    expect(calculateQuote(1, eth, eth).error).toBeTruthy()
    expect(calculateQuote(1, eth, { ...usdc, price: 0 }).error).toBeTruthy()
    expect(calculateQuote(Infinity, eth, usdc).error).toBeTruthy()
    expect(calculateQuote(Number.MAX_VALUE, eth, usdc).error).toBeTruthy()
    expect(calculateQuote(Number.MIN_VALUE, usdc, eth).error).toBeTruthy()
  })
  it('retains a visible small positive output', () => {
    expect(formatAmount(1e-12)).not.toBe('0')
    expect(formatAmount(1000)).toBe('1,000')
    expect(formatAmount(1e15)).toContain('E')
  })
})

it('maps icon case and encodes unknown symbols safely', () => {
  for (const [symbol, filename] of Object.entries({ STEVMOS: 'stEVMOS', RATOM: 'rATOM', STOSMO: 'stOSMO', STATOM: 'stATOM', STLUNA: 'stLUNA', bNEO: 'bNEO' })) {
    expect(tokenIconUrl(symbol)).toContain(`/tokens/${filename}.svg`)
  }
  expect(tokenIconUrl('a/b')).toContain('a%2Fb.svg')
})
