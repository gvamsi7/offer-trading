import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const config = {
  id: 'trading',
  name: 'Trading',
  shortName: 'Trading',
  description: 'Market watch, positions and execution monitoring.',
}

const css = `
.trading-offer{font-family:Inter,system-ui,sans-serif;color:#eef4ff}
.trading-offer .hero{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:22px;border:1px solid #2a3a5a;border-radius:18px;background:linear-gradient(135deg,#161d3d,#0a1630)}
.trading-offer h2{margin:0 0 8px;font-size:28px}.trading-offer p{margin:0;color:#9caed0}.trading-offer .trade{border:0;border-radius:10px;padding:10px 13px;background:#86a8ff;color:#081126;font-weight:800;cursor:pointer}
.trading-offer .markets{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:16px 0}.trading-offer .market{padding:17px;border:1px solid #27395b;border-radius:15px;background:#0d1830}
.trading-offer .market span{display:block;color:#8093b4;font-size:12px}.trading-offer .market strong{display:block;font-size:24px;margin-top:8px}.trading-offer .up{color:#68e1bd}.trading-offer .down{color:#ff8f9e}
.trading-offer .panel{border:1px solid #27395b;border-radius:16px;background:#0b172b;overflow:hidden}.trading-offer .panel h3{margin:0;padding:16px 18px;border-bottom:1px solid #223554}
.trading-offer table{width:100%;border-collapse:collapse}.trading-offer th,.trading-offer td{text-align:left;padding:13px 18px;border-bottom:1px solid #1d2d48;font-size:13px}.trading-offer th{color:#7589aa;font-size:11px;text-transform:uppercase}
@media(max-width:760px){.trading-offer .markets{grid-template-columns:1fr}.trading-offer .hero{flex-direction:column}}
`

function ensureStyle() {
  if (document.getElementById('trading-offer-style')) return
  const style = document.createElement('style')
  style.id = 'trading-offer-style'
  style.textContent = css
  document.head.appendChild(style)
}

function TradingApp({ host }) {
  const [positions, setPositions] = useState([
    { symbol: 'BTCUSDT', side: 'LONG', qty: '0.020', pnl: 84.2 },
    { symbol: 'XAUUSD', side: 'LONG', qty: '0.10', pnl: 31.7 },
    { symbol: 'NIFTY', side: 'SHORT', qty: '50', pnl: -18.4 },
  ])

  const totalPnl = useMemo(
    () => positions.reduce((sum, item) => sum + item.pnl, 0),
    [positions],
  )

  const simulateTrade = () => {
    setPositions((items) => items.map((item, index) =>
      index === 0 ? { ...item, pnl: item.pnl + 12.5 } : item
    ))
    host?.notify?.('Trade update', 'BTCUSDT position moved +$12.50.')
  }

  return (
    <section className="trading-offer">
      <div className="hero">
        <div>
          <h2>Trading Desk</h2>
          <p>This UI is running from the independent offer-trading repository.</p>
        </div>
        <button className="trade" onClick={simulateTrade}>Simulate tick</button>
      </div>

      <div className="markets">
        <div className="market"><span>BTCUSDT</span><strong>$64,280</strong><span className="up">+1.42%</span></div>
        <div className="market"><span>XAUUSD</span><strong>2,641.8</strong><span className="up">+0.38%</span></div>
        <div className="market"><span>Open P&amp;L</span><strong className={totalPnl >= 0 ? 'up' : 'down'}>{'$' + totalPnl.toFixed(2)}</strong></div>
      </div>

      <div className="panel">
        <h3>Open positions</h3>
        <table>
          <thead><tr><th>Symbol</th><th>Side</th><th>Qty</th><th>P&amp;L</th></tr></thead>
          <tbody>
            {positions.map((item) => (
              <tr key={item.symbol}>
                <td>{item.symbol}</td>
                <td>{item.side}</td>
                <td>{item.qty}</td>
                <td className={item.pnl >= 0 ? 'up' : 'down'}>{'$' + item.pnl.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const definition = {
  contractVersion: 1,
  config,
  mount({ element, host }) {
    if (!element) throw new Error('Trading offer requires a mount element.')
    ensureStyle()
    const root = createRoot(element)
    root.render(<TradingApp host={host} />)

    return {
      update() {},
      unmount() {
        root.unmount()
      },
    }
  },
}

window.__REMOTE_OFFERS__ = window.__REMOTE_OFFERS__ || {}
window.__REMOTE_OFFERS__[config.id] = definition
