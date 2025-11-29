import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Withdraw.scss';

type WithdrawType = 'fiat' | 'crypto';
type CryptoAsset = 'BTC' | 'ETH' | 'USDT' | 'SOL';

interface WithdrawHistory {
  id: string;
  date: string;
  type: string;
  amount: string;
  destination: string;
  status: 'completed' | 'pending' | 'failed';
}

const cryptoAssets: { symbol: CryptoAsset; name: string; network: string; icon: string; balance: number; fee: string }[] = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', icon: '₿', balance: 0.05234, fee: '0.0001 BTC' },
  { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', icon: 'Ξ', balance: 1.2345, fee: '0.002 ETH' },
  { symbol: 'USDT', name: 'Tether', network: 'ERC-20 / TRC-20', icon: '₮', balance: 5420.0, fee: '5 USDT' },
  { symbol: 'SOL', name: 'Solana', network: 'Solana', icon: '◎', balance: 45.678, fee: '0.01 SOL' },
];

const mockWithdrawHistory: WithdrawHistory[] = [
  { id: '1', date: '2024-01-20 15:20', type: 'PIX', amount: 'R$ 800,00', destination: '***90', status: 'completed' },
  { id: '2', date: '2024-01-19 11:45', type: 'BTC', amount: '0.002 BTC', destination: 'bc1q...fjhx', status: 'completed' },
  { id: '3', date: '2024-01-18 14:30', type: 'PIX', amount: 'R$ 1.200,00', destination: '***56', status: 'completed' },
  { id: '4', date: '2024-01-17 10:10', type: 'USDT', amount: '50 USDT', destination: '0x71...976F', status: 'pending' },
  { id: '5', date: '2024-01-16 16:00', type: 'PIX', amount: 'R$ 500,00', destination: '***90', status: 'completed' },
];

export function Withdraw() {
  const [searchParams] = useSearchParams();
  const [withdrawType, setWithdrawType] = useState<WithdrawType | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Detecta se veio um asset ou type pela URL e seleciona automaticamente
  useEffect(() => {
    const assetParam = searchParams.get('asset');
    const typeParam = searchParams.get('type');

    if (typeParam === 'fiat') {
      setWithdrawType('fiat');
    } else if (assetParam) {
      const validAsset = cryptoAssets.find(a => a.symbol === assetParam);
      if (validAsset) {
        setWithdrawType('crypto');
        setSelectedCrypto(validAsset.symbol as CryptoAsset);
      }
    }
  }, [searchParams]);

  const brlBalance = 15420.5;

  const handleBack = () => {
    if (success) {
      setSuccess(false);
      setAmount('');
      setCryptoAmount('');
      setCryptoAddress('');
      setSelectedCrypto(null);
      setWithdrawType(null);
    } else if (selectedCrypto) {
      setSelectedCrypto(null);
    } else {
      setWithdrawType(null);
    }
  };

  const handleFiatWithdraw = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
  };

  const handleCryptoWithdraw = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = (parseInt(numbers) / 100).toFixed(2);
    return amount === 'NaN' ? '' : amount;
  };

  // Tela de sucesso
  if (success) {
    return (
      <div className="withdraw-page">
        <div className="withdraw-container">
          <div className="success-screen">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <h2>Saque solicitado!</h2>
            <p>
              {withdrawType === 'fiat'
                ? 'Seu saque via PIX será processado em instantes.'
                : `Seu saque de ${cryptoAmount} ${selectedCrypto} está sendo processado.`}
            </p>
            <button className="btn-primary" onClick={handleBack}>
              Fazer outro saque
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela inicial - escolha do tipo
  if (!withdrawType) {
    return (
      <div className="withdraw-page">
        <div className="withdraw-container">
          <div className="withdraw-header">
            <h1>Sacar</h1>
            <p>Escolha o tipo de saque que deseja realizar</p>
          </div>

          <div className="withdraw-options">
            <button className="withdraw-option" onClick={() => setWithdrawType('fiat')}>
              <div className="option-icon fiat">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="option-info">
                <h3>Dinheiro (BRL)</h3>
                <p>Saque via PIX - Instantâneo</p>
                <span className="balance">Disponível: R$ {brlBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <svg className="option-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>

            <button className="withdraw-option" onClick={() => setWithdrawType('crypto')}>
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

  // Saque em BRL via PIX
  if (withdrawType === 'fiat') {
    return (
      <div className="withdraw-page">
        <div className="withdraw-container">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Voltar
          </button>

          <div className="withdraw-header">
            <h1>Saque via PIX</h1>
            <p>Saldo disponível: <strong>R$ {brlBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
          </div>

          <div className="withdraw-form">
            <div className="form-section">
              <h3>Chave PIX</h3>
              <input
                type="text"
                placeholder="CPF, E-mail, Telefone ou Chave aleatória"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>

            <div className="form-section">
              <h3>Valor do saque</h3>
              <div className="amount-input">
                <span className="currency">R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(formatCurrency(e.target.value))}
                />
                <button className="max-btn" onClick={() => setAmount(brlBalance.toFixed(2))}>
                  MAX
                </button>
              </div>
              <div className="amount-info">
                <span>Taxa: <strong>Grátis</strong></span>
                <span>Mínimo: <strong>R$ 10,00</strong></span>
              </div>
            </div>

            <div className="withdraw-summary">
              <div className="summary-row">
                <span>Valor do saque</span>
                <span>R$ {amount || '0,00'}</span>
              </div>
              <div className="summary-row">
                <span>Taxa</span>
                <span className="free">Grátis</span>
              </div>
              <div className="summary-row total">
                <span>Você receberá</span>
                <span>R$ {amount || '0,00'}</span>
              </div>
            </div>

            <button
              className="btn-primary btn-withdraw"
              onClick={handleFiatWithdraw}
              disabled={loading || !amount || parseFloat(amount) < 10 || !pixKey}
            >
              {loading ? <span className="loading-spinner"></span> : 'Confirmar saque'}
            </button>
          </div>

          <div className="info-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              Saques via PIX são processados instantaneamente, 24 horas por dia.
            </div>
          </div>

          <div className="history-section">
            <h3>Histórico de Saques</h3>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Destino</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockWithdrawHistory.map((withdraw) => (
                    <tr key={withdraw.id}>
                      <td>{withdraw.date}</td>
                      <td>{withdraw.type}</td>
                      <td>{withdraw.amount}</td>
                      <td>{withdraw.destination}</td>
                      <td>
                        <span className={`status-badge ${withdraw.status}`}>
                          {withdraw.status === 'completed' ? 'Concluído' : withdraw.status === 'pending' ? 'Pendente' : 'Falhou'}
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
  if (withdrawType === 'crypto' && !selectedCrypto) {
    return (
      <div className="withdraw-page">
        <div className="withdraw-container">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Voltar
          </button>

          <div className="withdraw-header">
            <h1>Sacar Criptomoeda</h1>
            <p>Selecione a moeda que deseja sacar</p>
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
                <div className="crypto-balance">
                  <span className="balance-amount">{asset.balance}</span>
                  <span className="balance-label">Disponível</span>
                </div>
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

  // Formulário de saque cripto
  const selectedAsset = cryptoAssets.find((a) => a.symbol === selectedCrypto);

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Voltar
        </button>

        <div className="withdraw-header">
          <div className="crypto-header-icon">{selectedAsset?.icon}</div>
          <h1>Sacar {selectedAsset?.name}</h1>
          <p>Disponível: <strong>{selectedAsset?.balance} {selectedCrypto}</strong></p>
        </div>

        <div className="withdraw-form">
          <div className="form-section">
            <div className="network-selector">
              <label>Rede</label>
              <div className="network-badge">{selectedAsset?.network}</div>
            </div>
          </div>

          <div className="form-section">
            <label>Endereço de destino</label>
            <input
              type="text"
              className="address-input"
              placeholder={`Endereço ${selectedCrypto}`}
              value={cryptoAddress}
              onChange={(e) => setCryptoAddress(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label>Quantidade</label>
            <div className="amount-input crypto">
              <input
                type="text"
                placeholder="0.00"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
              />
              <span className="currency">{selectedCrypto}</span>
              <button className="max-btn" onClick={() => setCryptoAmount(selectedAsset?.balance.toString() || '')}>
                MAX
              </button>
            </div>
          </div>

          <div className="withdraw-summary">
            <div className="summary-row">
              <span>Quantidade</span>
              <span>{cryptoAmount || '0'} {selectedCrypto}</span>
            </div>
            <div className="summary-row">
              <span>Taxa de rede</span>
              <span>{selectedAsset?.fee}</span>
            </div>
            <div className="summary-row total">
              <span>Você receberá</span>
              <span>
                {cryptoAmount
                  ? (parseFloat(cryptoAmount) - parseFloat(selectedAsset?.fee?.split(' ')[0] || '0')).toFixed(8)
                  : '0'}{' '}
                {selectedCrypto}
              </span>
            </div>
          </div>

          <button
            className="btn-primary btn-withdraw"
            onClick={handleCryptoWithdraw}
            disabled={loading || !cryptoAmount || !cryptoAddress || parseFloat(cryptoAmount) <= 0}
          >
            {loading ? <span className="loading-spinner"></span> : 'Confirmar saque'}
          </button>
        </div>

        <div className="info-box warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>Atenção:</strong> Verifique se o endereço está correto e se é compatível com a rede {selectedAsset?.network}. Transações em blockchain são irreversíveis.
          </div>
        </div>

        <div className="history-section">
          <h3>Histórico de Saques</h3>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Destino</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockWithdrawHistory.map((withdraw) => (
                  <tr key={withdraw.id}>
                    <td>{withdraw.date}</td>
                    <td>{withdraw.type}</td>
                    <td>{withdraw.amount}</td>
                    <td>{withdraw.destination}</td>
                    <td>
                      <span className={`status-badge ${withdraw.status}`}>
                        {withdraw.status === 'completed' ? 'Concluído' : withdraw.status === 'pending' ? 'Pendente' : 'Falhou'}
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
