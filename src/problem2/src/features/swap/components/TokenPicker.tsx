import { useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Token } from '../swap.types'
import { tokenName } from '../swap.utils'
import { TokenIcon } from './TokenIcon'

interface TokenPickerProps {
  tokens: Token[]
  value: string
  otherValue: string
  side: 'send' | 'receive'
  disabled: boolean
  onChange: (symbol: string) => void
}

export function TokenPicker({ tokens, value, otherValue, side, disabled, onChange }: TokenPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const filtered = tokens.filter(token => `${token.symbol} ${tokenName(token.symbol)}`.toLowerCase().includes(query))

  return <Dialog open={open} onOpenChange={next => { setOpen(next); setSearch('') }}>
    <DialogTrigger asChild>
      <Button type="button" variant="outline" className="token-select" disabled={disabled}
        aria-label={`Select ${side} token${value ? `, currently ${value}` : ''}`}>
        {value && <TokenIcon symbol={value} />}
        <span>{value || 'Select'}</span><ChevronDown aria-hidden="true" />
      </Button>
    </DialogTrigger>
    <DialogContent className="token-dialog">
      <DialogHeader>
        <DialogTitle>Select a token</DialogTitle>
        <DialogDescription>Choose the token you want to {side}.</DialogDescription>
      </DialogHeader>
      <div className="token-search">
        <Search size={18} aria-hidden="true" />
        <input aria-label="Search tokens" placeholder="Search name or symbol" value={search} onChange={event => setSearch(event.target.value)} />
      </div>
      <p className="token-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'token' : 'tokens'} available</p>
      <div className="token-list" aria-label="Available tokens">
        {filtered.map(token => <button key={token.symbol} type="button" className="token-option"
          disabled={token.symbol === otherValue} aria-pressed={token.symbol === value}
          aria-label={`Select ${token.symbol}`}
          onClick={() => { onChange(token.symbol); setOpen(false); setSearch('') }}>
          <TokenIcon symbol={token.symbol} />
          <span className="token-option-label"><strong>{token.symbol}</strong><span>{tokenName(token.symbol)}</span></span>
          {token.symbol === value && <Check size={18} aria-hidden="true" />}
          {token.symbol === otherValue && <span className="other-token">Other side</span>}
        </button>)}
        {!filtered.length && <p className="empty-search">No tokens found. Try another name or symbol.</p>}
      </div>
    </DialogContent>
  </Dialog>
}
