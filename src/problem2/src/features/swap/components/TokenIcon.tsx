import { useState } from 'react'
import { tokenIconUrl } from '../swap.utils'

export function TokenIcon({ symbol }: { symbol: string }) {
  const [failedSymbol, setFailedSymbol] = useState<string | null>(null)
  return <span className="token-icon" aria-hidden="true">
    {failedSymbol === symbol ? <span>{symbol.slice(0, 2)}</span> :
      <img src={tokenIconUrl(symbol)} alt="" width="32" height="32" onError={() => setFailedSymbol(symbol)} />}
  </span>
}
