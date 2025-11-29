import { useState } from 'react';
import './Deposit.scss';

type DepositType = 'fiat' | 'crypto';
type CryptoAsset = 'BTC' | 'ETH' | 'USDT' | 'SOL';

interface DepositHistory {
  id: string;
  date: string;
  type: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
}

const cryptoAssets: { symbol: CryptoAsset; name: string; network: string; icon: string }[] = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', icon: 'Ξ' },
  { symbol: 'USDT', name: 'Tether', network: 'ERC-20 / TRC-20', icon: '₮' },
  { symbol: 'SOL', name: 'Solana', network: 'Solana', icon: '◎' },
];

const cryptoAddresses: Record<CryptoAsset, string> = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  USDT: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  SOL: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
};

const mockDepositHistory: DepositHistory[] = [
  { id: '1', date: '2024-01-20 14:32', type: 'PIX', amount: 'R$ 1.500,00', status: 'completed' },
  { id: '2', date: '2024-01-19 10:15', type: 'BTC', amount: '0.005 BTC', status: 'completed' },
  { id: '3', date: '2024-01-18 16:45', type: 'PIX', amount: 'R$ 500,00', status: 'completed' },
  { id: '4', date: '2024-01-17 09:20', type: 'USDT', amount: '100 USDT', status: 'pending' },
  { id: '5', date: '2024-01-15 11:30', type: 'PIX', amount: 'R$ 2.000,00', status: 'completed' },
];

export function Deposit() {
  const [depositType, setDepositType] = useState<DepositType | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (selectedCrypto) {
      setSelectedCrypto(null);
    } else {
      setDepositType(null);
    }
  };

  // Tela inicial - escolha do tipo
  if (!depositType) {
    return (
      <div className="deposit-page">
        <div className="deposit-container">
          <div className="deposit-header">
            <h1>Depositar</h1>
            <p>Escolha o tipo de depósito que deseja realizar</p>
          </div>

          <div className="deposit-options">
            <button className="deposit-option" onClick={() => setDepositType('fiat')}>
              <div className="option-icon fiat">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="option-info">
                <h3>Dinheiro (BRL)</h3>
                <p>Depósito via PIX - Instantâneo e sem taxas</p>
              </div>
              <svg className="option-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>

            <button className="deposit-option" onClick={() => setDepositType('crypto')}>
              <div className="option-icon crypto">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="option-info">
                <h3>Criptomoeda</h3>
                <p>Bitcoin, Ethereum, USDT e outras</p>
              </div>
              <svg className="option-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Depósito em BRL via PIX
  if (depositType === 'fiat') {
    return (
      <div className="deposit-page">
        <div className="deposit-container">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Voltar
          </button>

          <div className="deposit-header">
            <h1>Depósito via PIX</h1>
            <p>Transfira qualquer valor para a chave PIX abaixo</p>
          </div>

          <div className="pix-deposit">
            <div className="qr-code-section">
              <div className="qr-code-placeholder">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="4" height="4" />
                  <line x1="21" y1="14" x2="21" y2="21" />
                  <line x1="14" y1="21" x2="21" y2="21" />
                </svg>
              </div>
              <span className="qr-label">Escaneie o QR Code</span>
            </div>

            <div className="pix-divider">
              <span>ou copie a chave PIX</span>
            </div>

            <div className="pix-key-section">
              <label>Chave PIX (CNPJ)</label>
              <div className="pix-key-field">
                <span>12.345.678/0001-90</span>
                <button className="copy-btn" onClick={() => handleCopy('12345678000190')}>
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="pix-info">
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <div>
                  <strong>Processamento instantâneo</strong>
                  <span>Seu saldo será creditado em segundos</span>
                </div>
              </div>
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <div>
                  <strong>Sem taxas</strong>
                  <span>Depósitos via PIX são gratuitos</span>
                </div>
              </div>
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <strong>Limite diário: R$ 50.000</strong>
                  <span>Para aumentar, complete a verificação KYC</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-box warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>Importante:</strong> O PIX deve ser enviado de uma conta bancária em seu nome (mesmo CPF/CNPJ cadastrado).
            </div>
          </div>

          <div className="history-section">
            <h3>Histórico de Depósitos</h3>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDepositHistory.map((deposit) => (
                    <tr key={deposit.id}>
                      <td>{deposit.date}</td>
                      <td>{deposit.type}</td>
                      <td>{deposit.amount}</td>
                      <td>
                        <span className={`status-badge ${deposit.status}`}>
                          {deposit.status === 'completed' ? 'Concluído' : deposit.status === 'pending' ? 'Pendente' : 'Falhou'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Seleção de criptomoeda
  if (depositType === 'crypto' && !selectedCrypto) {
    return (
      <div className="deposit-page">
        <div className="deposit-container">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Voltar
          </button>

          <div className="deposit-header">
            <h1>Depositar Criptomoeda</h1>
            <p>Selecione a moeda que deseja depositar</p>
          </div>

          <div className="crypto-list">
            {cryptoAssets.map((asset) => (
              <button
                key={asset.symbol}
                className="crypto-option"
                onClick={() => setSelectedCrypto(asset.symbol)}
              >
                <div className="crypto-icon">{asset.icon}</div>
                <div className="crypto-info">
                  <span className="crypto-symbol">{asset.symbol}</span>
                  <span className="crypto-name">{asset.name}</span>
                </div>
                <span className="crypto-network">{asset.network}</span>
                <svg className="option-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Endereço de depósito de cripto
  const selectedAsset = cryptoAssets.find((a) => a.symbol === selectedCrypto);

  return (
    <div className="deposit-page">
      <div className="deposit-container">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Voltar
        </button>

        <div className="deposit-header">
          <div className="crypto-header-icon">{selectedAsset?.icon}</div>
          <h1>Depositar {selectedAsset?.name}</h1>
          <p>Envie {selectedCrypto} para o endereço abaixo</p>
        </div>

        <div className="crypto-deposit">
          <div className="network-badge">
            Rede: <strong>{selectedAsset?.network}</strong>
          </div>

          <div className="qr-code-section">
            <div className="qr-code-placeholder">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="4" height="4" />
                <line x1="21" y1="14" x2="21" y2="21" />
                <line x1="14" y1="21" x2="21" y2="21" />
              </svg>
            </div>
          </div>

          <div className="address-section">
            <label>Endereço de depósito</label>
            <div className="address-field">
              <span className="address">{cryptoAddresses[selectedCrypto!]}</span>
              <button className="copy-btn" onClick={() => handleCopy(cryptoAddresses[selectedCrypto!])}>
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="deposit-details">
            <div className="detail-row">
              <span>Confirmações necessárias</span>
              <strong>{selectedCrypto === 'BTC' ? '3' : selectedCrypto === 'ETH' || selectedCrypto === 'USDT' ? '12' : '1'}</strong>
            </div>
            <div className="detail-row">
              <span>Depósito mínimo</span>
              <strong>
                {selectedCrypto === 'BTC' ? '0.0001 BTC' : selectedCrypto === 'ETH' ? '0.001 ETH' : selectedCrypto === 'USDT' ? '10 USDT' : '0.1 SOL'}
              </strong>
            </div>
          </div>
        </div>

        <div className="info-box warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>Atenção:</strong> Envie apenas {selectedCrypto} para este endereço. Enviar outras moedas pode resultar em perda permanente dos fundos.
          </div>
        </div>

        <div className="history-section">
          <h3>Histórico de Depósitos</h3>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockDepositHistory.map((deposit) => (
                  <tr key={deposit.id}>
                    <td>{deposit.date}</td>
                    <td>{deposit.type}</td>
                    <td>{deposit.amount}</td>
                    <td>
                      <span className={`status-badge ${deposit.status}`}>
                        {deposit.status === 'completed' ? 'Concluído' : deposit.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
