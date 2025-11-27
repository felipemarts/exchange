import { useState, useEffect, useCallback } from 'react';
import {
  TradingChart,
  OrderBook,
  OrderForm,
  OpenOrders,
  RecentTrades,
} from '../../components';
import { api, MockWebSocket } from '../../services/api';
import {
  TradingPair,
  OrderBook as OrderBookType,
  Trade,
  Order,
  User,
  OrderSide,
  OrderType,
} from '../../types';
import './Trading.scss';

interface TradingProps {
  user: User | null;
}

export function Trading({ user }: TradingProps) {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [currentPair, setCurrentPair] = useState<TradingPair | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookType | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [pairsData, ordersData] = await Promise.all([
          api.getTradingPairs(),
          api.getOpenOrders(),
        ]);

        setPairs(pairsData);
        setOrders(ordersData);

        if (pairsData.length > 0) {
          setCurrentPair(pairsData[0]);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (!currentPair) return;

    const loadPairData = async () => {
      const [orderBookData, tradesData] = await Promise.all([
        api.getOrderBook(currentPair.symbol),
        api.getRecentTrades(currentPair.symbol, 20),
      ]);

      setOrderBook(orderBookData);
      setTrades(tradesData);
    };

    loadPairData();

    const ws = new MockWebSocket(currentPair.symbol);

    ws.on('ticker', (data) => {
      setCurrentPair((prev) => (prev ? { ...prev, ...(data as TradingPair) } : null));
    });

    ws.on('orderbook', (data) => {
      setOrderBook(data as OrderBookType);
    });

    ws.on('trade', (data) => {
      setTrades((prev) => [data as Trade, ...prev.slice(0, 19)]);
    });

    return () => {
      ws.close();
    };
  }, [currentPair?.symbol]);

  const handlePairChange = useCallback(
    (symbol: string) => {
      const pair = pairs.find((p) => p.symbol === symbol);
      if (pair) {
        setCurrentPair(pair);
      }
    },
    [pairs]
  );

  const handleOrderSubmit = useCallback(
    async (orderData: {
      side: OrderSide;
      type: OrderType;
      price: number;
      amount: number;
    }) => {
      if (!currentPair) return;

      try {
        const newOrder = await api.createOrder({
          pair: currentPair.symbol,
          ...orderData,
        });
        setOrders((prev) => [newOrder, ...prev]);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    },
    [currentPair]
  );

  const handleCancelOrder = useCallback(async (orderId: string) => {
    try {
      const success = await api.cancelOrder(orderId);
      if (success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const } : o))
        );
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatVolume = (volume: number) => {
    return volume.toLocaleString('pt-BR', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    });
  };

  if (loading || !currentPair) {
    return (
      <div className="trading-loading">
        <div className="loader">
          <div className="spinner"></div>
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-page">
      <div className="trading-header">
        <div className="pair-selector">
          <span className="pair-label">PAR</span>
          <select
            className="pair-dropdown"
            value={currentPair.symbol}
            onChange={(e) => handlePairChange(e.target.value)}
          >
            {pairs.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                {p.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="price-info">
          <div className="price-item">
            <span className="price-label">ÚLTIMO PREÇO</span>
            <span className="price-value">
              {formatPrice(currentPair.lastPrice)} {currentPair.quote}
              <span className={`price-change ${currentPair.change24h >= 0 ? 'positive' : 'negative'}`}>
                {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h.toFixed(2)}%
              </span>
            </span>
          </div>

          <div className="price-item">
            <span className="price-label">MÁXIMA 24H</span>
            <span className="price-value">{formatPrice(currentPair.high24h)} {currentPair.quote}</span>
          </div>

          <div className="price-item">
            <span className="price-label">MÍNIMA 24H</span>
            <span className="price-value">{formatPrice(currentPair.low24h)} {currentPair.quote}</span>
          </div>

          <div className="price-item">
            <span className="price-label">VOLUME 24H</span>
            <span className="price-value">{formatVolume(currentPair.volume24h)} {currentPair.base}</span>
          </div>
        </div>
      </div>

      <div className="trading-main">
        <div className="left-column">
          <div className="chart-section">
            <TradingChart symbol={currentPair.symbol} />
          </div>
          <div className="open-orders-section">
            <OpenOrders
              orders={orders}
              currentPair={currentPair.symbol}
              onCancelOrder={handleCancelOrder}
            />
          </div>
        </div>

        <div className="center-column">
          <div className="orderbook-section">
            {orderBook && (
              <OrderBook
                orderBook={orderBook}
                lastPrice={currentPair.lastPrice}
                quote={currentPair.quote}
                base={currentPair.base}
              />
            )}
          </div>
          <div className="recent-trades-section">
            <RecentTrades
              trades={trades}
              quote={currentPair.quote}
              base={currentPair.base}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="order-form-section">
            <OrderForm
              pair={currentPair}
              user={user}
              onSubmit={handleOrderSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
