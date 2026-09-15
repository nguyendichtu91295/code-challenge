export interface Token {
  symbol: string
  price: number
  date: string
}

export interface Quote {
  rate: number
  receiveAmount: number
}

export type Result<T> = { value: T; error?: never } | { error: string; value?: never }

export interface SwapRequest {
  fromSymbol: string
  toSymbol: string
  sendAmount: number
  receiveAmount: number
  rate: number
}

export interface SwapResult extends SwapRequest { demo: true }
