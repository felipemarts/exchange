import { Trade } from '../../types';
import './RecentTrades.scss';

interface RecentTradesProps {
  trades: Trade[];
  quote: string;
  base: string;
}

export function RecentTrades({ trades, quote, base }: RecentTradesProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="recent-trades">
      <div className="recent-trades-header">
        <h3>Últimas negociações</h3>
      </div>

      <div className="trades-columns">
        <span>PREÇO ({quote})</span>
        <span>VOL. ({base})</span>
        <span>HORA</span>
      </div>

      <div className="trades-list">
        {trades.slice(0, 20).map((trade) => (
          <div key={trade.id} className={`trade-row ${trade.side}`}>
            <span className="price">{formatPrice(trade.price)}</span>
            <span className="amount">{formatAmount(trade.amount)}</span>
            <span className="time">{formatTime(trade.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
