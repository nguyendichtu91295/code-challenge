import { ArrowDownUp, ArrowUpRight } from 'lucide-react'
import { useTokenPrices } from './hooks/useTokenPrices'
import { SwapForm } from './components/SwapForm'

export function SwapPage() {
  const prices = useTokenPrices()
  return <div className="site-frame">
    <header className="site-header">
      <a className="brand" href="/" aria-label="Currency Swap home"><span className="brand-mark"><ArrowDownUp size={19} /></span>swap<span className="brand-dot">.</span></a>
      <span className="demo-badge"><span />Demo mode</span>
    </header>
    <main className="swap-main">
      <div className="intro"><p className="eyebrow">A LITTLE LESS COMPLICATED</p><h1>Swap, simply.</h1><p>Two tokens. One simple exchange.</p></div>
      <SwapForm tokens={prices.data ?? []} loading={prices.isPending} fetching={prices.isFetching}
        offline={prices.fetchStatus === 'paused'} error={prices.isError ? prices.error.message : null} onRetry={() => { void prices.refetch() }} />
      <p className="below-card">Your next move, without the guesswork.<ArrowUpRight size={14} aria-hidden="true" /></p>
    </main>
    <footer className="site-footer"><span>Currency Swap</span><span>Built for the simple things.</span></footer>
  </div>
}
