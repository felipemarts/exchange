import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Markets.scss';

interface TradingPair {
  symbol: string;
  base: string;
  quote: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export function Markets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuote, setActiveQuote] = useState<string>('ALL');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock data - replace with API call
  const pairs: TradingPair[] = [
    {
      symbol: 'BTC/BRL',
      base: 'BTC',
      quote: 'BRL',
      lastPrice: 500000,
      change24h: 2.5,
      volume24h: 15000000,
      high24h: 510000,
      low24h: 485000,
    },
    {
      symbol: 'ETH/BRL',
      base: 'ETH',
      quote: 'BRL',
      lastPrice: 5000,
      change24h: -1.2,
      volume24h: 8000000,
      high24h: 5100,
      low24h: 4900,
    },
    {
      symbol: 'USDT/BRL',
      base: 'USDT',
      quote: 'BRL',
      lastPrice: 5.0,
      change24h: 0.1,
      volume24h: 50000000,
      high24h: 5.05,
      low24h: 4.95,
    },
    {
      symbol: 'SOL/BRL',
      base: 'SOL',
      quote: 'BRL',
      lastPrice: 500,
      change24h: 5.8,
      volume24h: 3000000,
      high24h: 520,
      low24h: 470,
    },
    {
      symbol: 'XRP/BRL',
      base: 'XRP',
      quote: 'BRL',
      lastPrice: 3.0,
      change24h: -0.5,
      volume24h: 2000000,
      high24h: 3.1,
      low24h: 2.9,
    },
    {
      symbol: 'BTC/USDT',
      base: 'BTC',
      quote: 'USDT',
      lastPrice: 100000,
      change24h: 2.3,
      volume24h: 120000000,
      high24h: 102000,
      low24h: 97000,
    },
    {
      symbol: 'ETH/USDT',
      base: 'ETH',
      quote: 'USDT',
      lastPrice: 1000,
      change24h: -0.8,
      volume24h: 80000000,
      high24h: 1020,
      low24h: 980,
    },
    {
      symbol: 'SOL/USDT',
      base: 'SOL',
      quote: 'USDT',
      lastPrice: 100,
      change24h: 6.2,
      volume24h: 25000000,
      high24h: 104,
      low24h: 94,
    },
  ];

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

  const handlePairClick = (pair: TradingPair) => {
    navigate('/app/broker', { state: { pair: pair.symbol } });
  };

  return (
    <div className="markets-page">
      <div className="markets-header">
        <div>
          <h1>Mercados</h1>
          <p>Visualize todos os pares de negociação disponíveis</p>
        </div>
      </div>

      <div className="markets-toolbar">
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar par..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="filters">
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
      </div>

      <div className="markets-table">
        <div className="table-header">
          <span className="col-favorite"></span>
          <span className="col-pair">Par</span>
          <span className="col-price">Último Preço</span>
          <span className="col-change">24h Mudança</span>
          <span className="col-high">Máxima 24h</span>
          <span className="col-low">Mínima 24h</span>
          <span className="col-volume">Volume 24h</span>
          <span className="col-action"></span>
        </div>

        <div className="table-body">
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
              <div key={pair.symbol} className="table-row" onClick={() => handlePairClick(pair)}>
                <div className="col-favorite">
                  <button
                    className={`favorite-btn ${favorites.has(pair.symbol) ? 'favorited' : ''}`}
                    onClick={(e) => toggleFavorite(pair.symbol, e)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(pair.symbol) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>
                <div className="col-pair">
                  <span className="pair-symbol">{pair.symbol}</span>
                  <span className="pair-name">{pair.base}/{pair.quote}</span>
                </div>
                <div className="col-price">
                  {pair.lastPrice.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className={`col-change ${pair.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                </div>
                <div className="col-high">
                  {pair.high24h.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="col-low">
                  {pair.low24h.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="col-volume">
                  R$ {(pair.volume24h / 1000000).toFixed(2)}M
                </div>
                <div className="col-action">
                  <button className="trade-btn">
                    Negociar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
