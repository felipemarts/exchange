import { useState } from 'react';
import { OrderBook as OrderBookType } from '../../types';
import './OrderBook.scss';

interface OrderBookProps {
  orderBook: OrderBookType;
  lastPrice: number;
  quote: string;
  base: string;
}

type ViewMode = 'both' | 'bids' | 'asks';

export function OrderBook({ orderBook, lastPrice, quote, base }: OrderBookProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
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

  const maxTotal = Math.max(
    ...orderBook.asks.map((a) => a.total),
    ...orderBook.bids.map((b) => b.total)
  );

  return (
    <div className="order-book">
      <div className="order-book-header">
        <h3>Livro de ofertas</h3>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'both' ? 'active' : ''}`}
            title="Compra e Venda"
            onClick={() => setViewMode('both')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="2" y="2" width="12" height="5" fill="var(--danger-color)" />
              <rect x="2" y="9" width="12" height="5" fill="var(--success-color)" />
            </svg>
          </button>
          <button
            className={`toggle-btn ${viewMode === 'bids' ? 'active' : ''}`}
            title="Apenas Compra"
            onClick={() => setViewMode('bids')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="2" y="2" width="12" height="12" fill="var(--success-color)" />
            </svg>
          </button>
          <button
            className={`toggle-btn ${viewMode === 'asks' ? 'active' : ''}`}
            title="Apenas Venda"
            onClick={() => setViewMode('asks')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="2" y="2" width="12" height="12" fill="var(--danger-color)" />
            </svg>
          </button>
        </div>
      </div>

      <div className="order-book-content">
        <div className="order-book-columns">
          <span>PREÇO ({quote})</span>
          <span>VOL. ({base})</span>
          <span>TOTAL ({base})</span>
        </div>

        {(viewMode === 'both' || viewMode === 'asks') && (
          <div className={`asks-section ${viewMode === 'both' ? 'with-bids' : ''}`}>
            {orderBook.asks.map((ask, index) => (
              <div key={`ask-${index}`} className="order-row ask">
                <div
                  className="depth-bar"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <span className="price">{formatPrice(ask.price)}</span>
                <span className="amount">{formatAmount(ask.amount)}</span>
                <span className="total">{formatAmount(ask.total)}</span>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'both' && (
          <div className="spread-section">
            <div className="current-price">
              <span className="price-value">{formatPrice(lastPrice)} {quote}</span>
              <span className="spread-info">
                {formatPrice(orderBook.spread)} {quote}
                <span className="spread-percent">{orderBook.spreadPercent.toFixed(2)}%</span>
              </span>
            </div>
          </div>
        )}

        {(viewMode === 'both' || viewMode === 'bids') && (
          <div className="bids-section">
            {orderBook.bids.map((bid, index) => (
              <div key={`bid-${index}`} className="order-row bid">
                <div
                  className="depth-bar"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <span className="price">{formatPrice(bid.price)}</span>
                <span className="amount">{formatAmount(bid.amount)}</span>
                <span className="total">{formatAmount(bid.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
