import { useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, Check, CircleAlert, Info, LoaderCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSwap } from '../hooks/useSwap'
import { calculateQuote, isEditableAmount, validateAmount } from '../swap.validation'
import { defaultPair, formatAmount, formatPriceDate, tokenName } from '../swap.utils'
import type { Token } from '../swap.types'
import { TokenPicker } from './TokenPicker'

interface SwapFormProps {
  tokens: Token[]
  loading: boolean
  fetching: boolean
  offline: boolean
  error: string | null
  onRetry: () => void
}

export function SwapForm({ tokens, loading, fetching, offline, error, onRetry }: SwapFormProps) {
  const [amount, setAmount] = useState('')
  const [pair, setPair] = useState<[string, string] | null>(null)
  const [touched, setTouched] = useState(false)
  const swap = useSwap()
  const [fromSymbol, toSymbol] = pair && pair.every(symbol => tokens.some(token => token.symbol === symbol)) ? pair : defaultPair(tokens)
  const from = tokens.find(token => token.symbol === fromSymbol)
  const to = tokens.find(token => token.symbol === toSymbol)
  const parsed = validateAmount(amount)
  const quote = from && to && parsed.value !== undefined ? calculateQuote(parsed.value, from, to) : null
  const inputError = parsed.error ?? quote?.error
  const insufficient = !loading && !error && tokens.length < 2
  const blocked = loading || offline || !!error || insufficient
  const pending = swap.isPending
  const valid = !blocked && !pending && !!quote?.value
  const dates = [...new Set([from?.date, to?.date].filter((date): date is string => !!date).map(formatPriceDate))]

  function updatePair(next: [string, string]) { setPair(next); swap.reset() }
  function handleAmountChange(nextAmount: string) {
    if (!isEditableAmount(nextAmount)) return
    setAmount(nextAmount)
    swap.reset()
  }
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (!valid || parsed.value === undefined || !quote?.value) return
    swap.submit({ fromSymbol, toSymbol, sendAmount: parsed.value, receiveAmount: quote.value.receiveAmount, rate: quote.value.rate })
  }

  return <form className="swap-card" onSubmit={handleSubmit} noValidate aria-label="Currency swap">
    <div className="card-heading"><h2>Swap tokens</h2><span className="card-hint">Preview & confirm</span></div>
    {(blocked || fetching) && <div className={error || insufficient ? 'feed-notice error-notice' : 'feed-notice'} role={error || insufficient ? 'alert' : 'status'}>
      {offline ? <><CircleAlert size={18} /><span>You’re offline. Reconnect to load prices.</span></> :
        error || insufficient ? <><CircleAlert size={18} /><span>{error || 'Not enough token prices are available.'}</span></> :
          <><LoaderCircle className="spin" size={18} /><span>{loading ? 'Loading token prices…' : 'Refreshing prices…'}</span></>}
      {(error || insufficient || offline) && <Button type="button" variant="ghost" disabled={fetching || offline || pending} onClick={onRetry}>Retry</Button>}
    </div>}
    <div className="amount-panel send-panel">
      <div className="panel-label"><label htmlFor="send-amount">You send</label><span>{from ? tokenName(from.symbol) : 'From'}</span></div>
      <div className="amount-row">
        <input id="send-amount" aria-label="Amount to send" className="amount-input" inputMode="decimal" autoComplete="off" spellCheck={false}
          placeholder="0.00" value={amount} disabled={pending || blocked} aria-invalid={touched && !!inputError}
          aria-describedby={touched && inputError ? 'amount-error' : undefined}
          onBlur={() => setTouched(true)} onChange={event => handleAmountChange(event.target.value)} />
        <TokenPicker tokens={tokens} value={fromSymbol} otherValue={toSymbol} side="send" disabled={pending || blocked}
          onChange={symbol => updatePair([symbol, toSymbol])} />
      </div>
      <p className="panel-foot">Enter the amount you want to exchange</p>
    </div>
    <div className="reverse-row"><Button type="button" variant="outline" size="icon" className="reverse-button"
      disabled={blocked || pending} aria-label="Reverse token pair" onClick={() => updatePair([toSymbol, fromSymbol])}>
      <ArrowDown size={18} aria-hidden="true" />
    </Button></div>
    <div className="amount-panel receive-panel">
      <div className="panel-label"><label htmlFor="receive-amount">You receive</label><span>Estimated</span></div>
      <div className="amount-row">
        <input id="receive-amount" className="amount-input receive-value" aria-label="Amount to receive" readOnly tabIndex={-1}
          value={!blocked && quote?.value ? formatAmount(quote.value.receiveAmount) : ''} placeholder="0.00" />
        <TokenPicker tokens={tokens} value={toSymbol} otherValue={fromSymbol} side="receive" disabled={pending || blocked}
          onChange={symbol => updatePair([fromSymbol, symbol])} />
      </div>
      <p className="panel-foot">{to ? tokenName(to.symbol) : 'Choose a token to see your estimate'}</p>
    </div>
    {touched && inputError && !blocked && <p id="amount-error" className="inline-error" role="alert">{inputError}</p>}
    <div className="quote-details">
      <div className="detail-row"><span><RefreshCw size={14} aria-hidden="true" /> Exchange rate</span>
        <strong>{!blocked && from && to && calculateQuote(1, from, to).value ?
          `1 ${fromSymbol} = ${formatAmount(from.price / to.price)} ${toSymbol}` : '—'}</strong></div>
      <div className="detail-row secondary-detail"><span>Price date (UTC)</span><span>{dates.length ? dates.join(' / ') : '—'}</span></div>
    </div>
    <Button className="confirm-button" type="submit" disabled={!valid}>
      {pending ? <><LoaderCircle className="spin" aria-hidden="true" /> Swapping…</> :
        <>{swap.isError ? 'Try swap again' : 'Confirm swap'}<ArrowRight size={18} aria-hidden="true" /></>}
    </Button>
    <div aria-live="polite" aria-atomic="true">
      {pending && <p className="sr-only">Your demo swap is being processed.</p>}
      {swap.isError && <div className="result-message result-error" role="alert"><CircleAlert size={20} /><div><strong>Swap not completed</strong><p>{swap.error.message}</p></div></div>}
      {swap.isSuccess && <div className="result-message result-success"><Check size={20} /><div><strong>Demo swap complete</strong>
        <p>{formatAmount(swap.data.sendAmount)} {swap.data.fromSymbol} → {formatAmount(swap.data.receiveAmount)} {swap.data.toSymbol}</p><p>No assets were moved.</p></div></div>}
    </div>
    <p className="demo-note"><Info size={15} aria-hidden="true" /><span>A demo using historical prices. No wallet or real funds.</span></p>
  </form>
}
