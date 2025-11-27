import { useState, useEffect, useCallback } from 'react';
import {
  Header,
  TradingChart,
  OrderBook,
  OrderForm,
  OpenOrders,
  RecentTrades,
} from './components';
import { api, MockWebSocket } from './services/api';
import {
  TradingPair,
  OrderBook as OrderBookType,
  Trade,
  Order,
  User,
  OrderSide,
  OrderType,
} from './types';
import './App.scss';

function App() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [currentPair, setCurrentPair] = useState<TradingPair | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookType | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [pairsData, userData, ordersData] = await Promise.all([
          api.getTradingPairs(),
          api.getUser(),
          api.getOpenOrders(),
        ]);

        setPairs(pairsData);
        setUser(userData);
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

  // Load pair-specific data
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

    // Set up WebSocket for real-time updates
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

  if (loading || !currentPair) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="spinner"></div>
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="exchange-app">
      <Header
        pair={currentPair}
        pairs={pairs}
        user={user}
        onPairChange={handlePairChange}
      />

      <main className="exchange-main">
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
      </main>
    </div>
  );
}

export default App;
