import { useNavigate } from 'react-router-dom';
import { TradingPair, User } from '../../types';
import './Header.scss';

interface HeaderProps {
  pair: TradingPair;
  pairs: TradingPair[];
  user: User | null;
  onPairChange: (symbol: string) => void;
}

export function Header({ pair, pairs, user, onPairChange }: HeaderProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatVolume = (volume: number) => {
    return volume.toLocaleString('pt-BR', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    });
  };

  return (
    <header className="exchange-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">A</div>
          <span className="logo-name">AmazonEx</span>
        </div>

        <div className="pair-selector">
          <span className="pair-label">PAR</span>
          <select
            className="pair-dropdown"
            value={pair.symbol}
            onChange={(e) => onPairChange(e.target.value)}
          >
            {pairs.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                {p.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="price-info">
          <div className="price-item">
            <span className="price-label">ÚLTIMO PREÇO</span>
            <span className="price-value">
              {formatPrice(pair.lastPrice)} {pair.quote}
              <span className={`price-change ${pair.change24h >= 0 ? 'positive' : 'negative'}`}>
                {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
              </span>
            </span>
          </div>

          <div className="price-item">
            <span className="price-label">MÁXIMA 24H</span>
            <span className="price-value">{formatPrice(pair.high24h)} {pair.quote}</span>
          </div>

          <div className="price-item">
            <span className="price-label">MÍNIMA 24H</span>
            <span className="price-value">{formatPrice(pair.low24h)} {pair.quote}</span>
          </div>

          <div className="price-item">
            <span className="price-label">VOLUME 24H</span>
            <span className="price-value">{formatVolume(pair.volume24h)} {pair.base}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="btn-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Alertas de preço
        </button>

        <button className="btn-deposit" onClick={() => navigate('/app/deposit')}>Depositar</button>

        <div className="user-menu">
          <button className="btn-transfer">
            Movimentar
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <button className="btn-help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          <button className="btn-settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {user && (
            <div className="user-profile">
              <span className="user-name">{user.name}</span>
              <div className="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
