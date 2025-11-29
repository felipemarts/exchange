import { useState } from 'react';
import { WalletAsset } from '../../types';
import './Wallet.scss';

interface WalletProps {
  assets: WalletAsset[];
}

export function Wallet({ assets }: WalletProps) {
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasBalance = !hideSmallBalances || asset.brlValue >= 10;
    return matchesSearch && hasBalance;
  });

  const totalBrlValue = assets.reduce((sum, asset) => sum + asset.brlValue, 0);
  const totalBtcValue = assets.reduce((sum, asset) => sum + asset.btcValue, 0);

  const formatCurrency = (value: number, decimals = 2) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCrypto = (value: number, decimals = 8) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <h1>Carteira</h1>
        <div className="wallet-actions">
          <button className="btn-primary">Depositar</button>
          <button className="btn-secondary">Sacar</button>
          <button className="btn-secondary">Transferir</button>
        </div>
      </div>

      <div className="wallet-summary">
        <div className="summary-card">
          <span className="label">Patrimônio Total</span>
          <span className="value">R$ {formatCurrency(totalBrlValue)}</span>
          <span className="btc-value">{formatCrypto(totalBtcValue)} BTC</span>
        </div>
        <div className="summary-card">
          <span className="label">Disponível</span>
          <span className="value">
            R$ {formatCurrency(assets.reduce((sum, a) => sum + (a.availableBalance / a.balance) * a.brlValue || 0, 0))}
          </span>
        </div>
        <div className="summary-card">
          <span className="label">Em Ordens</span>
          <span className="value">
            R$ {formatCurrency(assets.reduce((sum, a) => sum + (a.lockedBalance / a.balance) * a.brlValue || 0, 0))}
          </span>
        </div>
      </div>

      <div className="wallet-filters">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar ativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="wallet-table">
        <div className="table-header">
          <span>Ativo</span>
          <span>Saldo Total</span>
          <span>Disponível</span>
          <span>Em Ordens</span>
          <span>Valor em BRL</span>
          <span>Ações</span>
        </div>
        <div className="table-body">
          {filteredAssets.map((asset) => (
            <div key={asset.symbol} className="table-row">
              <div className="asset-info">
                <div className="asset-icon">{asset.symbol.charAt(0)}</div>
                <div className="asset-details">
                  <span className="asset-symbol">{asset.symbol}</span>
                  <span className="asset-name">{asset.name}</span>
                </div>
              </div>
              <div className="balance-cell">
                <span className="balance">{formatCrypto(asset.balance)}</span>
              </div>
              <div className="balance-cell">
                <span className="balance">{formatCrypto(asset.availableBalance)}</span>
              </div>
              <div className="balance-cell">
                <span className="balance">{formatCrypto(asset.lockedBalance)}</span>
              </div>
              <div className="value-cell">
                <span className="brl-value">R$ {formatCurrency(asset.brlValue)}</span>
                <span className={`change ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </span>
              </div>
              <div className="actions-cell">
                <button className="btn-action">Depositar</button>
                <button className="btn-action">Sacar</button>
                <button className="btn-action">Negociar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
