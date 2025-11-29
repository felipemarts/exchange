import { useState, useMemo } from 'react';
import './PairSelectorModal.scss';

interface TradingPair {
  symbol: string;
  base: string;
  quote: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
}

interface PairSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairs: TradingPair[];
  currentPair: string;
  onSelectPair: (symbol: string) => void;
}

export function PairSelectorModal({
  isOpen,
  onClose,
  pairs,
  currentPair,
  onSelectPair,
}: PairSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuote, setActiveQuote] = useState<string>('ALL');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const quotes = useMemo(() => {
    const uniqueQuotes = new Set(pairs.map(p => p.quote));
    return ['ALL', 'FAVORITOS', ...Array.from(uniqueQuotes)];
  }, [pairs]);

  const filteredPairs = useMemo(() => {
    return pairs.filter(pair => {
      const matchesSearch =
        pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.quote.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesQuote =
        activeQuote === 'ALL' ||
        (activeQuote === 'FAVORITOS' && favorites.has(pair.symbol)) ||
        pair.quote === activeQuote;

      return matchesSearch && matchesQuote;
    });
  }, [pairs, searchQuery, activeQuote, favorites]);

  const handleSelectPair = (symbol: string) => {
    onSelectPair(symbol);
    onClose();
    setSearchQuery('');
  };

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="pair-selector-modal-overlay" onClick={onClose}>
      <div className="pair-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Selecionar Par</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar par..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="modal-filters">
          {quotes.map(quote => (
            <button
              key={quote}
              className={`filter-btn ${activeQuote === quote ? 'active' : ''}`}
              onClick={() => setActiveQuote(quote)}
            >
              {quote}
            </button>
          ))}
        </div>

        <div className="modal-list-header">
          <span className="col-favorite"></span>
          <span className="col-pair">Par</span>
          <span className="col-price">Preço</span>
          <span className="col-change">24h</span>
        </div>

        <div className="modal-list">
          {filteredPairs.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p>Nenhum par encontrado</p>
            </div>
          ) : (
            filteredPairs.map(pair => (
              <button
                key={pair.symbol}
                className={`pair-item ${currentPair === pair.symbol ? 'active' : ''}`}
                onClick={() => handleSelectPair(pair.symbol)}
              >
                <div className="pair-favorite">
                  <button
                    className={`favorite-btn ${favorites.has(pair.symbol) ? 'favorited' : ''}`}
                    onClick={(e) => toggleFavorite(pair.symbol, e)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(pair.symbol) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>
                <div className="pair-info">
                  <span className="pair-symbol">{pair.symbol}</span>
                  <span className="pair-base">{pair.base}/{pair.quote}</span>
                </div>
                <div className="pair-price">
                  {pair.lastPrice.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className={`pair-change ${pair.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
