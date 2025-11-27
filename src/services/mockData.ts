import { TradingPair, OrderBook, Trade, Order, User, WalletAsset, Transaction } from '../types';

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
  {
    id: 'order-3',
    pair: 'ETH/BRL',
    side: 'buy',
    type: 'limit',
    price: 17500.00,
    amount: 1.5,
    filled: 1.5,
    status: 'filled',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'order-4',
    pair: 'BTC/BRL',
    side: 'sell',
    type: 'market',
    price: 485000.00,
    amount: 0.05,
    filled: 0.05,
    status: 'filled',
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'order-5',
    pair: 'USDT/BRL',
    side: 'buy',
    type: 'limit',
    price: 5.00,
    amount: 500,
    filled: 0,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 259200000),
  },
];

export const mockWalletAssets: WalletAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.52345678,
    availableBalance: 0.50345678,
    lockedBalance: 0.02,
    btcValue: 0.52345678,
    brlValue: 255432.50,
    change24h: 3.67,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 5.12340000,
    availableBalance: 5.12340000,
    lockedBalance: 0,
    btcValue: 0.18765432,
    brlValue: 93456.78,
    change24h: 2.34,
  },
  {
    symbol: 'BRL',
    name: 'Real Brasileiro',
    balance: 50000.00,
    availableBalance: 45200.00,
    lockedBalance: 4800.00,
    btcValue: 0.10234567,
    brlValue: 50000.00,
    change24h: 0,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: 1234.56,
    availableBalance: 1234.56,
    lockedBalance: 0,
    btcValue: 0.01234567,
    brlValue: 6320.95,
    change24h: 0.15,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 25.50000000,
    availableBalance: 25.50000000,
    lockedBalance: 0,
    btcValue: 0.05678901,
    brlValue: 12750.00,
    change24h: -1.23,
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    balance: 5000.00000000,
    availableBalance: 5000.00000000,
    lockedBalance: 0,
    btcValue: 0.01234567,
    brlValue: 7500.00,
    change24h: -0.45,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'deposit',
    asset: 'BRL',
    amount: 10000.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
    description: 'Depósito via PIX',
  },
  {
    id: 'tx-2',
    type: 'trade',
    asset: 'BTC',
    amount: 0.05,
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    description: 'Compra de BTC/BRL',
  },
  {
    id: 'tx-3',
    type: 'trade',
    asset: 'BRL',
    amount: -24250.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    description: 'Compra de BTC/BRL',
  },
  {
    id: 'tx-4',
    type: 'fee',
    asset: 'BRL',
    amount: -48.50,
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    description: 'Taxa de negociação (0.2%)',
  },
  {
    id: 'tx-5',
    type: 'withdrawal',
    asset: 'BTC',
    amount: -0.1,
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000),
    txHash: '0x1234567890abcdef',
    description: 'Saque para carteira externa',
  },
  {
    id: 'tx-6',
    type: 'deposit',
    asset: 'ETH',
    amount: 2.5,
    status: 'completed',
    timestamp: new Date(Date.now() - 172800000),
    txHash: '0xabcdef1234567890',
    description: 'Depósito de ETH',
  },
  {
    id: 'tx-7',
    type: 'withdrawal',
    asset: 'BRL',
    amount: -5000.00,
    status: 'pending',
    timestamp: new Date(Date.now() - 1800000),
    description: 'Saque via PIX - Aguardando confirmação',
  },
  {
    id: 'tx-8',
    type: 'trade',
    asset: 'SOL',
    amount: 10.0,
    status: 'completed',
    timestamp: new Date(Date.now() - 259200000),
    description: 'Compra de SOL/BRL',
  },
];
