import type { Token } from './swap.types'

export class PriceDataError extends Error {}

export function normalizePrices(data: unknown): Token[] {
  if (!Array.isArray(data)) throw new PriceDataError('The price service returned an invalid response.')
  const tokens = new Map<string, Token>()
  for (const row of data) {
    if (!row || typeof row !== 'object') continue
    const { currency, price, date } = row as Record<string, unknown>
    if (typeof currency !== 'string' || !currency.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price <= 0 ||
        typeof date !== 'string' || !Number.isFinite(Date.parse(date))) continue
    const symbol = currency.trim()
    const previous = tokens.get(symbol)
    if (!previous || Date.parse(date) >= Date.parse(previous.date)) {
      tokens.set(symbol, { symbol, price, date: new Date(date).toISOString() })
    }
  }
  return [...tokens.values()].sort((a, b) => a.symbol.localeCompare(b.symbol, 'en'))
}

export function defaultPair(tokens: Token[]): [string, string] {
  if (tokens.some(token => token.symbol === 'ETH') && tokens.some(token => token.symbol === 'USDC')) {
    return ['ETH', 'USDC']
  }
  return [tokens[0]?.symbol ?? '', tokens[1]?.symbol ?? '']
}

const iconNames: Record<string, string> = {
  STEVMOS: 'stEVMOS', RATOM: 'rATOM', STOSMO: 'stOSMO', STATOM: 'stATOM', STLUNA: 'stLUNA',
}

export function tokenIconUrl(symbol: string): string {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${encodeURIComponent(iconNames[symbol] ?? symbol)}.svg`
}

const tokenNames: Record<string, string> = {
  ETH: 'Ethereum', USDC: 'USD Coin', WBTC: 'Wrapped Bitcoin', ATOM: 'Cosmos',
  OSMO: 'Osmosis', SWTH: 'Switcheo', BUSD: 'Binance USD', USD: 'US Dollar',
  bNEO: 'Neo', wstETH: 'Wrapped staked Ether', axlUSDC: 'Axelar USD Coin',
  LUNA: 'Terra', EVMOS: 'Evmos', ZIL: 'Zilliqa', BLUR: 'Blur', GMX: 'GMX',
}

export function tokenName(symbol: string): string { return tokenNames[symbol] ?? symbol }

export function formatAmount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 8,
    notation: value !== 0 && (Math.abs(value) < 0.0000001 || Math.abs(value) >= 1e12) ? 'scientific' : 'standard',
  }).format(value)
}

export function formatPriceDate(date: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
}
