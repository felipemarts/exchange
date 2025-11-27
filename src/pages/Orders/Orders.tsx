import { useState } from 'react';
import { Order } from '../../types';
import './Orders.scss';

interface OrdersProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

export function Orders({ orders, onCancelOrder }: OrdersProps) {
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [pairFilter, setPairFilter] = useState('all');
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all');

  const uniquePairs = [...new Set(orders.map((o) => o.pair))];

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === 'open'
        ? order.status === 'open' || order.status === 'partial'
        : order.status === 'filled' || order.status === 'cancelled';
    const matchesPair = pairFilter === 'all' || order.pair === pairFilter;
    const matchesSide = sideFilter === 'all' || order.side === sideFilter;
    return matchesTab && matchesPair && matchesSide;
  });

  const openOrdersCount = orders.filter(
    (o) => o.status === 'open' || o.status === 'partial'
  ).length;

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
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: 'Aberta',
      partial: 'Parcial',
      filled: 'Executada',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  };

  const getProgress = (order: Order) => {
    return (order.filled / order.amount) * 100;
  };

  const handleCancelAll = () => {
    const openOrders = orders.filter(
      (o) => o.status === 'open' || o.status === 'partial'
    );
    openOrders.forEach((o) => onCancelOrder(o.id));
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Ordens</h1>
        {activeTab === 'open' && openOrdersCount > 0 && (
          <button className="btn-cancel-all" onClick={handleCancelAll}>
            Cancelar todas ({openOrdersCount})
          </button>
        )}
      </div>

      <div className="orders-tabs">
        <button
          className={`tab ${activeTab === 'open' ? 'active' : ''}`}
          onClick={() => setActiveTab('open')}
        >
          Ordens Abertas
          {openOrdersCount > 0 && <span className="badge">{openOrdersCount}</span>}
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
      </div>

      <div className="orders-filters">
        <div className="filter-group">
          <label>Par</label>
          <select value={pairFilter} onChange={(e) => setPairFilter(e.target.value)}>
            <option value="all">Todos os pares</option>
            {uniquePairs.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Lado</label>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value as typeof sideFilter)}
          >
            <option value="all">Todos</option>
            <option value="buy">Compra</option>
            <option value="sell">Venda</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <span>Data</span>
          <span>Par</span>
          <span>Tipo</span>
          <span>Lado</span>
          <span>Preço</span>
          <span>Quantidade</span>
          <span>Preenchido</span>
          <span>Total</span>
          <span>Status</span>
          {activeTab === 'open' && <span>Ação</span>}
        </div>
        <div className="table-body">
          {filteredOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="date-cell">
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="pair-cell">
                <span>{order.pair}</span>
              </div>
              <div className="type-cell">
                <span className={`type-badge ${order.type}`}>
                  {order.type === 'limit' ? 'Limite' : 'Mercado'}
                </span>
              </div>
              <div className="side-cell">
                <span className={`side-badge ${order.side}`}>
                  {order.side === 'buy' ? 'Compra' : 'Venda'}
                </span>
              </div>
              <div className="price-cell">
                <span>{formatPrice(order.price)}</span>
              </div>
              <div className="amount-cell">
                <span>{formatAmount(order.amount)}</span>
              </div>
              <div className="filled-cell">
                <div className="filled-info">
                  <span>{formatAmount(order.filled)}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${getProgress(order)}%` }}
                    />
                  </div>
                  <span className="progress-text">{getProgress(order).toFixed(0)}%</span>
                </div>
              </div>
              <div className="total-cell">
                <span>{formatPrice(order.price * order.amount)}</span>
              </div>
              <div className="status-cell">
                <span className={`status-badge ${order.status}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              {activeTab === 'open' && (
                <div className="action-cell">
                  <button
                    className="btn-cancel"
                    onClick={() => onCancelOrder(order.id)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            <line x1="9" y1="12" x2="15" y2="12" />
          </svg>
          <h3>
            {activeTab === 'open'
              ? 'Nenhuma ordem aberta'
              : 'Nenhuma ordem no histórico'}
          </h3>
          <p>
            {activeTab === 'open'
              ? 'Você não tem ordens abertas no momento.'
              : 'Não há ordens no histórico para os filtros selecionados.'}
          </p>
        </div>
      )}
    </div>
  );
}
