import { TradingPair, OrderBook, Trade, Order, User } from '../types';

export const tradingPairs: TradingPair[] = [
  {
    symbol: 'BTC/BRL',
    base: 'BTC',
    quote: 'BRL',
    lastPrice: 488334.00,
    change24h: 3.67,
    high24h: 491047.00,
    low24h: 464800.00,
    volume24h: 28.52103093,
  },
  {
    symbol: 'ETH/BRL',
    base: 'ETH',
    quote: 'BRL',
    lastPrice: 18234.50,
    change24h: 2.34,
    high24h: 18500.00,
    low24h: 17800.00,
    volume24h: 156.78,
  },
  {
    symbol: 'USDT/BRL',
    base: 'USDT',
    quote: 'BRL',
    lastPrice: 5.12,
    change24h: 0.15,
    high24h: 5.15,
    low24h: 5.08,
    volume24h: 125000.00,
  },
];

export const generateOrderBook = (basePrice: number): OrderBook => {
  const asks: { price: number; amount: number; total: number }[] = [];
  const bids: { price: number; amount: number; total: number }[] = [];

  let askTotal = 0;
  let bidTotal = 0;

  for (let i = 0; i < 15; i++) {
    const askPrice = basePrice + (i + 1) * (basePrice * 0.0002);
    const askAmount = Math.random() * 0.5;
    askTotal += askAmount;
    asks.push({
      price: askPrice,
      amount: askAmount,
      total: askTotal,
    });

    const bidPrice = basePrice - (i + 1) * (basePrice * 0.0002);
    const bidAmount = Math.random() * 0.5;
    bidTotal += bidAmount;
    bids.push({
      price: bidPrice,
      amount: bidAmount,
      total: bidTotal,
    });
  }

  const spread = asks[0].price - bids[0].price;
  const spreadPercent = (spread / basePrice) * 100;

  return {
    asks: asks.reverse(),
    bids,
    spread,
    spreadPercent,
  };
};

export const generateRecentTrades = (basePrice: number, count: number = 20): Trade[] => {
  const trades: Trade[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const priceVariation = (Math.random() - 0.5) * basePrice * 0.005;
    trades.push({
      id: `trade-${i}`,
      price: basePrice + priceVariation,
      amount: Math.random() * 0.1,
      timestamp: new Date(now.getTime() - i * 30000),
      side: Math.random() > 0.5 ? 'buy' : 'sell',
    });
  }

  return trades;
};

export const mockUser: User = {
  id: 'user-1',
  name: 'Felipe L.',
  email: 'felipe@email.com',
  balances: {
    BRL: 50000.00,
    BTC: 0.5,
    ETH: 5.0,
    USDT: 1000.00,
  },
};

export const mockOpenOrders: Order[] = [
  {
    id: 'order-1',
    pair: 'BTC/BRL',
    side: 'buy',
    type: 'limit',
    price: 480000.00,
    amount: 0.01,
    filled: 0,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'order-2',
    pair: 'BTC/BRL',
    side: 'sell',
    type: 'limit',
    price: 495000.00,
    amount: 0.02,
    filled: 0.005,
    status: 'partial',
    createdAt: new Date(Date.now() - 7200000),
  },
];
