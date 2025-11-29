import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change24h: number;
  price: string;
}

interface Activity {
  id: string;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell';
  asset: string;
  amount: string;
  value: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

const portfolioAssets: Asset[] = [
  { symbol: 'BRL', name: 'Real', balance: '1.500,00', value: 'R$ 1.500,00', change24h: 0, price: 'R$ 1,00' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.00125000', value: 'R$ 625,00', change24h: 2.5, price: 'R$ 500.000,00' },
  { symbol: 'ETH', name: 'Ethereum', balance: '0.15000000', value: 'R$ 750,00', change24h: -1.2, price: 'R$ 5.000,00' },
  { symbol: 'USDT', name: 'Tether', balance: '500.00', value: 'R$ 2.500,00', change24h: 0.1, price: 'R$ 5,00' },
  { symbol: 'SOL', name: 'Solana', balance: '2.50', value: 'R$ 1.250,00', change24h: 5.8, price: 'R$ 500,00' },
];

const recentActivity: Activity[] = [
  { id: '1', type: 'deposit', asset: 'BRL', amount: 'R$ 1.000,00', value: 'R$ 1.000,00', date: new Date(Date.now() - 1000 * 60 * 30), status: 'completed' },
  { id: '2', type: 'buy', asset: 'BTC', amount: '0.001 BTC', value: 'R$ 500,00', date: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'completed' },
  { id: '3', type: 'sell', asset: 'ETH', amount: '0.05 ETH', value: 'R$ 250,00', date: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'completed' },
  { id: '4', type: 'withdraw', asset: 'BRL', amount: 'R$ 500,00', value: 'R$ 500,00', date: new Date(Date.now() - 1000 * 60 * 60 * 48), status: 'completed' },
];

const marketData = [
  { symbol: 'BTC', name: 'Bitcoin', price: 'R$ 500.000,00', change: 2.5, volume: 'R$ 2.5B' },
  { symbol: 'ETH', name: 'Ethereum', price: 'R$ 5.000,00', change: -1.2, volume: 'R$ 1.2B' },
  { symbol: 'SOL', name: 'Solana', price: 'R$ 500,00', change: 5.8, volume: 'R$ 800M' },
  { symbol: 'XRP', name: 'Ripple', price: 'R$ 3,00', change: -0.5, volume: 'R$ 500M' },
  { symbol: 'ADA', name: 'Cardano', price: 'R$ 2,50', change: 3.2, volume: 'R$ 300M' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [showBalances, setShowBalances] = useState(true);

  const totalBalance = 'R$ 6.625,00';
  const totalChange = 2.3;
  const totalChangeValue = 'R$ 149,18';

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Agora mesmo';
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'deposit':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        );
      case 'withdraw':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        );
      case 'buy':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        );
      case 'sell':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        );
    }
  };

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'deposit': return 'Depósito';
      case 'withdraw': return 'Saque';
      case 'buy': return 'Compra';
      case 'sell': return 'Venda';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Bem-vindo de volta!</h1>
          <p>Aqui está um resumo da sua conta</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => navigate('/app/deposit')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Depositar
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/app/withdraw')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Sacar
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/app/trade')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Negociar
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="portfolio-card">
          <div className="card-header">
            <h2>Patrimônio Total</h2>
            <button className="visibility-btn" onClick={() => setShowBalances(!showBalances)}>
              {showBalances ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
          <div className="total-balance">
            <span className="balance-value">{showBalances ? totalBalance : '••••••'}</span>
            <span className={`balance-change ${totalChange >= 0 ? 'positive' : 'negative'}`}>
              {totalChange >= 0 ? '+' : ''}{totalChange}% ({showBalances ? totalChangeValue : '••••'})
            </span>
          </div>

          <div className="assets-list">
            <div className="list-header">
              <span>Ativo</span>
              <span>Saldo</span>
              <span>Valor</span>
              <span>24h</span>
            </div>
            {portfolioAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="asset-row"
                onClick={() => asset.symbol === 'BRL' ? navigate('/app/wallet') : navigate(`/app/trade?pair=${asset.symbol}/BRL`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="asset-info">
                  <div className="asset-icon">{asset.symbol.charAt(0)}</div>
                  <div className="asset-details">
                    <span className="symbol">{asset.symbol}</span>
                    <span className="name">{asset.name}</span>
                  </div>
                </div>
                <span className="balance">{showBalances ? asset.balance : '••••'}</span>
                <span className="value">{showBalances ? asset.value : '••••'}</span>
                <span className={`change ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                </span>
              </div>
            ))}
          </div>

          <button className="see-all-btn" onClick={() => navigate('/app/wallet')}>
            Ver carteira completa
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="side-cards">
          <div className="activity-card">
            <div className="card-header">
              <h2>Atividade Recente</h2>
              <button onClick={() => navigate('/app/statement')}>Ver tudo</button>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-details">
                    <span className="activity-type">{getActivityLabel(activity.type)}</span>
                    <span className="activity-amount">{activity.amount}</span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-value">{showBalances ? activity.value : '••••'}</span>
                    <span className="activity-time">{formatTime(activity.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="market-card">
            <div className="card-header">
              <h2>Mercado</h2>
              <button onClick={() => navigate('/app/markets')}>Ver tudo</button>
            </div>
            <div className="market-list">
              {marketData.map((coin) => (
                <div key={coin.symbol} className="market-item" onClick={() => navigate(`/app/trade?pair=${coin.symbol}/BRL`)}>
                  <div className="coin-info">
                    <div className="coin-icon">{coin.symbol.charAt(0)}</div>
                    <div className="coin-details">
                      <span className="symbol">{coin.symbol}</span>
                      <span className="name">{coin.name}</span>
                    </div>
                  </div>
                  <div className="coin-price">
                    <span className="price">{coin.price}</span>
                    <span className={`change ${coin.change >= 0 ? 'positive' : 'negative'}`}>
                      {coin.change >= 0 ? '+' : ''}{coin.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <div className="info-icon security">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="info-content">
            <h3>Proteja sua conta</h3>
            <p>Ative a autenticação de dois fatores para maior segurança.</p>
            <button onClick={() => navigate('/app/settings/2fa')}>Configurar 2FA</button>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon verify">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="info-content">
            <h3>Verifique sua identidade</h3>
            <p>Complete a verificação KYC para aumentar seus limites.</p>
            <button onClick={() => navigate('/app/settings/kyc')}>Verificar agora</button>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon support">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="info-content">
            <h3>Precisa de ajuda?</h3>
            <p>Nossa equipe de suporte está disponível 24/7.</p>
            <button>Falar com suporte</button>
          </div>
        </div>
      </div>
    </div>
  );
}
