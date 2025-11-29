import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PairSelectorModal } from '../../components';
import './QuickTrade.scss';

interface CryptoAsset {
  symbol: string;
  name: string;
  balance: string;
  balanceBRL: string;
  price: string;
  change24h: number;
}

const cryptoAssets: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.00125000', balanceBRL: 'R$ 625,00', price: 'R$ 500.000,00', change24h: 2.5 },
  { symbol: 'ETH', name: 'Ethereum', balance: '0.15000000', balanceBRL: 'R$ 750,00', price: 'R$ 5.000,00', change24h: -1.2 },
  { symbol: 'USDT', name: 'Tether', balance: '500.00000000', balanceBRL: 'R$ 2.500,00', price: 'R$ 5,00', change24h: 0.1 },
  { symbol: 'SOL', name: 'Solana', balance: '2.50000000', balanceBRL: 'R$ 1.250,00', price: 'R$ 500,00', change24h: 5.8 },
  { symbol: 'XRP', name: 'Ripple', balance: '150.00000000', balanceBRL: 'R$ 450,00', price: 'R$ 3,00', change24h: -0.5 },
];

interface Order {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: string;
  price: string;
  total: string;
  status: 'pending' | 'completed' | 'cancelled';
  date: Date;
}

interface TradingPair {
  symbol: string;
  base: string;
  quote: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
}

const tradingPairs: TradingPair[] = [
  { symbol: 'BTC/BRL', base: 'BTC', quote: 'BRL', lastPrice: 500000, change24h: 2.5, volume24h: 1250000 },
  { symbol: 'ETH/BRL', base: 'ETH', quote: 'BRL', lastPrice: 5000, change24h: -1.2, volume24h: 850000 },
  { symbol: 'USDT/BRL', base: 'USDT', quote: 'BRL', lastPrice: 5, change24h: 0.1, volume24h: 2500000 },
  { symbol: 'SOL/BRL', base: 'SOL', quote: 'BRL', lastPrice: 500, change24h: 5.8, volume24h: 450000 },
  { symbol: 'XRP/BRL', base: 'XRP', quote: 'BRL', lastPrice: 3, change24h: -0.5, volume24h: 320000 },
  { symbol: 'BTC/USDT', base: 'BTC', quote: 'USDT', lastPrice: 100000, change24h: 2.3, volume24h: 5500000 },
  { symbol: 'ETH/USDT', base: 'ETH', quote: 'USDT', lastPrice: 1000, change24h: -0.8, volume24h: 3200000 },
  { symbol: 'SOL/USDT', base: 'SOL', quote: 'USDT', lastPrice: 100, change24h: 6.2, volume24h: 980000 },
];

export function QuickTrade() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(cryptoAssets[0]);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [selectedPair, setSelectedPair] = useState<string>('BTC/BRL');

  // Detecta se veio um par pela URL e seleciona automaticamente
  useEffect(() => {
    const pairParam = searchParams.get('pair');
    if (pairParam) {
      const validPair = tradingPairs.find(p => p.symbol === pairParam);
      if (validPair) {
        setSelectedPair(pairParam);
        const base = pairParam.split('/')[0];
        const asset = cryptoAssets.find(a => a.symbol === base);
        if (asset) {
          setSelectedAsset(asset);
        }
      }
    }
  }, [searchParams]);

  const brlBalance = 'R$ 1.500,00';
  const brlInOrders = 'R$ 0,00';
  const cryptoBalance = selectedAsset.balance;
  const cryptoInOrders = '0.00000000';

  const orders: Order[] = [];

  const handleSelectPair = (symbol: string) => {
    setSelectedPair(symbol);
    const base = symbol.split('/')[0];
    const asset = cryptoAssets.find(a => a.symbol === base);
    if (asset) {
      setSelectedAsset(asset);
      setBuyAmount('');
      setSellAmount('');
    }
  };

  const handleBuyPercentage = (percent: number) => {
    const available = 1500;
    const value = (available * percent) / 100;
    setBuyAmount(value.toFixed(2));
  };

  const handleSellPercentage = (percent: number) => {
    const available = parseFloat(selectedAsset.balance);
    const value = (available * percent) / 100;
    setSellAmount(value.toFixed(8));
  };

  const handleBuySliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value);
    const available = 1500;
    const value = (available * percent) / 100;
    setBuyAmount(value.toFixed(2));
  };

  const handleSellSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value);
    const available = parseFloat(selectedAsset.balance);
    const value = (available * percent) / 100;
    setSellAmount(value.toFixed(8));
  };

  const getBuySliderValue = () => {
    if (!buyAmount) return 0;
    const amountValue = parseFloat(buyAmount.replace(',', '.'));
    const available = 1500;
    return (amountValue / available) * 100;
  };

  const getSellSliderValue = () => {
    if (!sellAmount) return 0;
    const amountValue = parseFloat(sellAmount.replace(',', '.'));
    const available = parseFloat(selectedAsset.balance);
    return (amountValue / available) * 100;
  };

  const calculateBuyTotal = () => {
    if (!buyAmount) return '0,00';
    const price = parseFloat(selectedAsset.price.replace(/[^\d,]/g, '').replace(',', '.'));
    const qty = parseFloat(buyAmount.replace(',', '.'));
    return (qty / price).toFixed(8);
  };

  const calculateSellTotal = () => {
    if (!sellAmount) return '0,00';
    const price = parseFloat(selectedAsset.price.replace(/[^\d,]/g, '').replace(',', '.'));
    const qty = parseFloat(sellAmount.replace(',', '.'));
    return (qty * price).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <div className="quick-trade-page">
      <div className="quick-trade-sidebar">
        <div className="sidebar-header">
          <span>SELECIONAR ATIVO</span>
        </div>

        <button
          className="selected-asset"
          onClick={() => setShowPairSelector(true)}
        >
          <div className="asset-icon">{selectedAsset.symbol.charAt(0)}</div>
          <div className="asset-info">
            <span className="symbol">{selectedAsset.symbol}</span>
            <span className="name">{selectedAsset.name}</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {showAssetSelector && (
          <div className="asset-selector">
            {cryptoAssets.map((asset) => (
              <button
                key={asset.symbol}
                className={`asset-option ${selectedAsset.symbol === asset.symbol ? 'active' : ''}`}
                onClick={() => {
                  setSelectedAsset(asset);
                  setShowAssetSelector(false);
                }}
              >
                <div className="asset-icon">{asset.symbol.charAt(0)}</div>
                <div className="asset-info">
                  <span className="symbol">{asset.symbol}</span>
                  <span className="name">{asset.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="balance-section">
          <div className="balance-item">
            <span className="label">SALDO DISPONÍVEL {selectedAsset.symbol}</span>
            <span className="value highlight">{cryptoBalance}</span>
          </div>
          <div className="balance-item">
            <span className="label">EM ORDENS {selectedAsset.symbol}</span>
            <span className="value">{cryptoInOrders}</span>
          </div>
          <div className="balance-item">
            <span className="label">SALDO DISPONÍVEL R$</span>
            <span className="value">{brlBalance}</span>
          </div>
          <div className="balance-item">
            <span className="label">EM ORDENS R$</span>
            <span className="value">{brlInOrders}</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <h4>NEGOCIAR {selectedAsset.symbol}</h4>
          <button className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Negociação rápida
          </button>
          <button className="nav-item" onClick={() => navigate('/app/broker')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Negociação avançada
          </button>
        </div>

        <div className="sidebar-nav">
          <h4>MOVIMENTAR {selectedAsset.symbol}</h4>
          <button className="nav-item" onClick={() => navigate('/app/statement')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Ver extrato
          </button>
          <button className="nav-item" onClick={() => navigate('/app/deposit')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Receber
          </button>
          <button className="nav-item" onClick={() => navigate('/app/withdraw')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Enviar
          </button>
        </div>
      </div>

      <div className="quick-trade-content">
        <div className="content-header">
          <h1>Negociação rápida</h1>
        </div>

        <div className="asset-header">
          <div className="asset-icon large">{selectedAsset.symbol.charAt(0)}</div>
          <span className="asset-name">{selectedAsset.name} ({selectedAsset.symbol})</span>
          <button className="favorite-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>

        <div className="trade-panels">
          <div className={`trade-panel buy ${activeTab === 'buy' ? 'active' : ''}`}>
            {activeTab !== 'buy' && (
              <div className="panel-overlay" onClick={() => setActiveTab('buy')} />
            )}
            <button className="panel-header" onClick={() => setActiveTab('buy')}>
              COMPRAR
            </button>
            <div className="panel-content">
              {parseFloat(brlBalance.replace(/[^\d,]/g, '').replace(',', '.')) > 0 ? (
                <>
                  <div className="summary">
                    <div className="summary-row">
                      <span>Saldo disponível:</span>
                      <strong>{brlBalance}</strong>
                    </div>
                  </div>
                  <div className="amount-input">
                    <label>Valor em R$</label>
                    <div className="input-wrapper">
                      <span className="prefix">R$</span>
                      <input
                        type="text"
                        placeholder="0,00"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        disabled={activeTab !== 'buy'}
                      />
                    </div>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={getBuySliderValue()}
                      onChange={handleBuySliderChange}
                      className="amount-slider"
                      disabled={activeTab !== 'buy'}
                      style={{ '--slider-progress': `${getBuySliderValue()}%` } as React.CSSProperties}
                    />
                  </div>
                  <p className="min-value">Valor mínimo de compra R$ 1,00</p>
                  <div className="percentage-buttons">
                    <button onClick={() => handleBuyPercentage(25)}>25%</button>
                    <button onClick={() => handleBuyPercentage(50)}>50%</button>
                    <button onClick={() => handleBuyPercentage(75)}>75%</button>
                    <button onClick={() => handleBuyPercentage(100)}>100%</button>
                  </div>
                  <div className="summary">
                    <div className="summary-row">
                      <span>Você receberá:</span>
                      <strong className="highlight">{calculateBuyTotal()} {selectedAsset.symbol}</strong>
                    </div>
                  </div>
                  <button className="action-btn buy" disabled={activeTab !== 'buy'}>
                    Comprar {selectedAsset.symbol}
                  </button>
                </>
              ) : (
                <>
                  <p className="no-balance">Você não possui saldo suficiente para realizar uma compra.</p>
                  <p className="min-value">Valor mínimo de compra R$ 1,00</p>
                  <div className="percentage-buttons">
                    <button disabled>25%</button>
                    <button disabled>50%</button>
                    <button disabled>75%</button>
                    <button disabled>100%</button>
                  </div>
                  <div className="summary">
                    <span>Saldo disponível para compra:</span>
                    <strong>{brlBalance}</strong>
                  </div>
                  <button className="action-btn deposit" onClick={() => navigate('/app/deposit')}>
                    Realizar novo depósito
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={`trade-panel sell ${activeTab === 'sell' ? 'active' : ''}`}>
            {activeTab !== 'sell' && (
              <div className="panel-overlay" onClick={() => setActiveTab('sell')} />
            )}
            <button className="panel-header" onClick={() => setActiveTab('sell')}>
              VENDER
            </button>
            <div className="panel-content">
              {parseFloat(selectedAsset.balance) > 0 ? (
                <>
                  <div className="summary">
                    <div className="summary-row">
                      <span>Saldo disponível:</span>
                      <strong>{selectedAsset.balance} {selectedAsset.symbol}</strong>
                    </div>
                  </div>
                  <div className="amount-input">
                    <label>Quantidade em {selectedAsset.symbol}</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="0.00000000"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        disabled={activeTab !== 'sell'}
                      />
                      <span className="suffix">{selectedAsset.symbol}</span>
                    </div>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={getSellSliderValue()}
                      onChange={handleSellSliderChange}
                      className="amount-slider"
                      disabled={activeTab !== 'sell'}
                      style={{ '--slider-progress': `${getSellSliderValue()}%` } as React.CSSProperties}
                    />
                  </div>
                  <p className="min-value sell">Valor mínimo para venda R$ 1,00</p>
                  <div className="percentage-buttons">
                    <button onClick={() => handleSellPercentage(25)}>25%</button>
                    <button onClick={() => handleSellPercentage(50)}>50%</button>
                    <button onClick={() => handleSellPercentage(75)}>75%</button>
                    <button onClick={() => handleSellPercentage(100)}>100%</button>
                  </div>
                  <div className="summary">
                    <div className="summary-row">
                      <span>Você receberá:</span>
                      <strong className="highlight">R$ {calculateSellTotal()}</strong>
                    </div>
                  </div>
                  <button className="action-btn sell" disabled={activeTab !== 'sell'}>
                    Vender {selectedAsset.symbol}
                  </button>
                </>
              ) : (
                <>
                  <p className="no-balance">Você não possui saldo suficiente para realizar uma venda.</p>
                  <p className="min-value sell">Valor mínimo para venda R$ 1,00</p>
                  <div className="percentage-buttons">
                    <button disabled>25%</button>
                    <button disabled>50%</button>
                    <button disabled>75%</button>
                    <button disabled>100%</button>
                  </div>
                  <div className="summary">
                    <span>Saldo estimado para venda:</span>
                    <strong className="sell">R$ 0,00</strong>
                  </div>
                  <button className="action-btn continue" disabled>
                    Continuar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="orders-section">
          <div className="orders-header">
            <h2>Minhas Ordens</h2>
            <button className="see-all-btn" onClick={() => navigate('/app/orders')}>
              Ver tudo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="orders-filters">
            <div className="filter-group">
              <span>STATUS</span>
              <div className="filter-buttons">
                <button
                  className={statusFilter === 'all' ? 'active' : ''}
                  onClick={() => setStatusFilter('all')}
                >
                  Todas
                </button>
                <button
                  className={statusFilter === 'open' ? 'active' : ''}
                  onClick={() => setStatusFilter('open')}
                >
                  Abertas
                </button>
              </div>
            </div>
            <div className="filter-group">
              <span>TIPO</span>
              <div className="filter-buttons">
                <button
                  className={typeFilter === 'all' ? 'active' : ''}
                  onClick={() => setTypeFilter('all')}
                >
                  Todas
                </button>
                <button
                  className={typeFilter === 'sell' ? 'active' : ''}
                  onClick={() => setTypeFilter('sell')}
                >
                  Venda
                </button>
                <button
                  className={typeFilter === 'buy' ? 'active' : ''}
                  onClick={() => setTypeFilter('buy')}
                >
                  Compra
                </button>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3>Nenhuma ordem aqui</h3>
              <p>Suas ordens de {selectedAsset.name} negociadas irão aparecer aqui. Comece a negociar agora.</p>
            </div>
          ) : (
            <div className="orders-list">
              {/* Orders would be rendered here */}
            </div>
          )}
        </div>
      </div>

      <PairSelectorModal
        isOpen={showPairSelector}
        onClose={() => setShowPairSelector(false)}
        pairs={tradingPairs}
        currentPair={selectedPair}
        onSelectPair={handleSelectPair}
      />
    </div>
  );
}
