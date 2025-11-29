import { useState } from 'react';
import { OrderSide, OrderType, TradingPair, User } from '../../types';
import './OrderForm.scss';

interface OrderFormProps {
  pair: TradingPair;
  user: User | null;
  onSubmit: (order: {
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
  }) => void;
}

export function OrderForm({ pair, user, onSubmit }: OrderFormProps) {
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [price, setPrice] = useState<string>(pair.lastPrice.toFixed(2));
  const [amount, setAmount] = useState<string>('');

  const balance = user?.balances[side === 'buy' ? pair.quote : pair.base] || 0;
  const total = (parseFloat(amount) || 0) * (orderType === 'market' ? pair.lastPrice : parseFloat(price) || 0);

  const handlePercentClick = (percent: number) => {
    if (side === 'buy') {
      const maxAmount = balance / (orderType === 'market' ? pair.lastPrice : parseFloat(price) || pair.lastPrice);
      setAmount((maxAmount * percent).toFixed(8));
    } else {
      setAmount((balance * percent).toFixed(8));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value);
    handlePercentClick(percent / 100);
  };

  const getSliderValue = () => {
    if (!amount || amount === '') return 0;
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) return 0;

    if (side === 'buy') {
      const priceToUse = orderType === 'market' ? pair.lastPrice : parseFloat(price) || pair.lastPrice;
      const maxAmount = balance / priceToUse;
      return maxAmount > 0 ? Math.min((amountValue / maxAmount) * 100, 100) : 0;
    } else {
      return balance > 0 ? Math.min((amountValue / balance) * 100, 100) : 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderPrice = orderType === 'market' ? pair.lastPrice : parseFloat(price);
    const orderAmount = parseFloat(amount);

    if (orderAmount > 0) {
      onSubmit({
        side,
        type: orderType,
        price: orderPrice,
        amount: orderAmount,
      });
      setAmount('');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="order-form">
      <div className="side-tabs">
        <button
          className={`side-tab buy ${side === 'buy' ? 'active' : ''}`}
          onClick={() => setSide('buy')}
        >
          Compra
        </button>
        <button
          className={`side-tab sell ${side === 'sell' ? 'active' : ''}`}
          onClick={() => setSide('sell')}
        >
          Venda
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <select
            className="order-type-select"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
          >
            <option value="market">Ordem Mercado</option>
            <option value="limit">Ordem Limite</option>
          </select>
        </div>

        {orderType === 'limit' && (
          <div className="form-group">
            <label>Preço limite</label>
            <div className="input-group">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
              />
              <span className="input-suffix">{pair.quote}</span>
            </div>
          </div>
        )}

        {orderType === 'market' && (
          <div className="form-group">
            <label>Preço mercado</label>
            <div className="input-group disabled">
              <input
                type="text"
                value={formatCurrency(pair.lastPrice)}
                disabled
              />
              <span className="input-suffix">{pair.quote}</span>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Valor de {side === 'buy' ? 'Compra' : 'Venda'}</label>
          <div className="input-group m-0">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00000000"
              step="0.00000001"
              min="0"
            />
            <span className="input-suffix">{pair.base}</span>
          </div>
          <div className="balance-info">
            <span>Saldo disponível:</span>
            <span className="balance-value">
              {formatCurrency(balance)} {side === 'buy' ? pair.quote : pair.base}
            </span>
          </div>
        </div>


        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={getSliderValue()}
            onChange={handleSliderChange}
            className="amount-slider"
            style={{ '--slider-progress': `${getSliderValue()}%` } as React.CSSProperties}
          />
        </div>

        <div className="percent-buttons">
          <button type="button" onClick={() => handlePercentClick(0.25)}>25%</button>
          <button type="button" onClick={() => handlePercentClick(0.5)}>50%</button>
          <button type="button" onClick={() => handlePercentClick(0.75)}>75%</button>
          <button type="button" onClick={() => handlePercentClick(1)}>100%</button>
        </div>

        <div className="form-group">
          <label>Total</label>
          <div className="input-group disabled">
            <input
              type="text"
              value={amount ? formatCurrency(total) : ''}
              placeholder="0.00000000"
              disabled
            />
            <span className="input-suffix">{pair.base}</span>
          </div>
        </div>

        <button
          type="submit"
          className={`submit-btn ${side}`}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          {side === 'buy' ? 'Comprar' : 'Vender'}
        </button>
      </form>
    </div>
  );
}
