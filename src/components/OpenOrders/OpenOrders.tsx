import { useState } from 'react';
import { Order } from '../../types';
import './OpenOrders.scss';

interface OpenOrdersProps {
  orders: Order[];
  currentPair: string;
  onCancelOrder: (orderId: string) => void;
}

export function OpenOrders({ orders, currentPair, onCancelOrder }: OpenOrdersProps) {
  const [filterCurrentPair, setFilterCurrentPair] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'open' | 'all'>('open');

  const filteredOrders = orders.filter((order) => {
    if (filterCurrentPair && order.pair !== currentPair) return false;
    if (statusFilter === 'open' && order.status !== 'open' && order.status !== 'partial') return false;
    return true;
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="open-orders">
      <div className="open-orders-header">
        <h3>Ordens</h3>
        <div className="order-filters">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filterCurrentPair}
              onChange={(e) => setFilterCurrentPair(e.target.checked)}
            />
            Somente este par
          </label>
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'open' | 'all')}
          >
            <option value="open">Abertas</option>
            <option value="all">Todas</option>
          </select>
          <button className="cancel-all-btn">Cancelar tudo</button>
        </div>
      </div>

      <div className="orders-table">
        {filteredOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Par</th>
                <th>Tipo</th>
                <th>Lado</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Preenchido</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.pair}</td>
                  <td className="order-type">
                    {order.type === 'limit' ? 'Limite' : 'Mercado'}
                  </td>
                  <td className={`order-side ${order.side}`}>
                    {order.side === 'buy' ? 'Compra' : 'Venda'}
                  </td>
                  <td>{formatPrice(order.price)}</td>
                  <td>{formatAmount(order.amount)}</td>
                  <td>{formatAmount(order.filled)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <button
                      className="cancel-btn"
                      onClick={() => onCancelOrder(order.id)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p className="empty-title">Nenhuma ordem aqui</p>
            <p className="empty-subtitle">
              Suas ordens negociadas irão aparecer aqui. Comece a negociar agora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
