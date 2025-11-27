import { useState } from 'react';
import { Transaction } from '../../types';
import './Statement.scss';

interface StatementProps {
  transactions: Transaction[];
}

export function Statement({ transactions }: StatementProps) {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'trade' | 'fee'>('all');
  const [dateRange, setDateRange] = useState('30d');

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, decimals = 8) => {
    const prefix = amount >= 0 ? '+' : '';
    return prefix + amount.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      trade: 'Negociação',
      fee: 'Taxa',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      completed: 'Concluído',
      failed: 'Falhou',
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        );
      case 'withdrawal':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        );
      case 'trade':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        );
      case 'fee':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="statement-page">
      <div className="statement-header">
        <h1>Extrato</h1>
        <div className="header-actions">
          <button className="btn-export">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      <div className="statement-filters">
        <div className="filter-group">
          <label>Tipo</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">Todos</option>
            <option value="deposit">Depósitos</option>
            <option value="withdrawal">Saques</option>
            <option value="trade">Negociações</option>
            <option value="fee">Taxas</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Período</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
            <option value="all">Todo período</option>
          </select>
        </div>
      </div>

      <div className="statement-summary">
        <div className="summary-item">
          <span className="label">Total de entradas</span>
          <span className="value positive">
            + R$ {transactions
              .filter((tx) => tx.type === 'deposit' && tx.status === 'completed')
              .reduce((sum, tx) => sum + tx.amount, 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Total de saídas</span>
          <span className="value negative">
            - R$ {Math.abs(transactions
              .filter((tx) => tx.type === 'withdrawal' && tx.status === 'completed')
              .reduce((sum, tx) => sum + tx.amount, 0))
              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Transações</span>
          <span className="value">{filteredTransactions.length}</span>
        </div>
      </div>

      <div className="statement-table">
        <div className="table-header">
          <span>Data</span>
          <span>Tipo</span>
          <span>Ativo</span>
          <span>Valor</span>
          <span>Status</span>
          <span>Detalhes</span>
        </div>
        <div className="table-body">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="table-row">
              <div className="date-cell">
                <span>{formatDate(tx.timestamp)}</span>
              </div>
              <div className="type-cell">
                <div className={`type-badge ${tx.type}`}>
                  {getTypeIcon(tx.type)}
                  <span>{getTypeLabel(tx.type)}</span>
                </div>
              </div>
              <div className="asset-cell">
                <span>{tx.asset}</span>
              </div>
              <div className={`amount-cell ${tx.amount >= 0 ? 'positive' : 'negative'}`}>
                <span>{formatAmount(tx.amount)}</span>
              </div>
              <div className="status-cell">
                <span className={`status-badge ${tx.status}`}>
                  {getStatusLabel(tx.status)}
                </span>
              </div>
              <div className="details-cell">
                <span className="description">{tx.description}</span>
                {tx.txHash && (
                  <a href={`#${tx.txHash}`} className="tx-link">
                    Ver transação
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3>Nenhuma transação encontrada</h3>
          <p>Não há transações para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
