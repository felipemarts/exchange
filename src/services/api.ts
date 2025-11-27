import { TradingPair, OrderBook, Trade, Order, User, OrderSide, OrderType } from '../types';
import { tradingPairs, generateOrderBook, generateRecentTrades, mockUser, mockOpenOrders } from './mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Trading Pairs
  async getTradingPairs(): Promise<TradingPair[]> {
    await delay(100);
    return tradingPairs;
  },

  async getTradingPair(symbol: string): Promise<TradingPair | undefined> {
    await delay(50);
    return tradingPairs.find(p => p.symbol === symbol);
  },

  // Order Book
  async getOrderBook(symbol: string): Promise<OrderBook> {
    await delay(50);
    const pair = tradingPairs.find(p => p.symbol === symbol);
    const basePrice = pair?.lastPrice || 488334;
    return generateOrderBook(basePrice);
  },

  // Recent Trades
  async getRecentTrades(symbol: string, limit: number = 20): Promise<Trade[]> {
    await delay(50);
    const pair = tradingPairs.find(p => p.symbol === symbol);
    const basePrice = pair?.lastPrice || 488334;
    return generateRecentTrades(basePrice, limit);
  },

  // User
  async getUser(): Promise<User> {
    await delay(100);
    return mockUser;
  },

  async getUserBalance(currency: string): Promise<number> {
    await delay(50);
    return mockUser.balances[currency] || 0;
  },

  // Orders
  async getOpenOrders(symbol?: string): Promise<Order[]> {
    await delay(100);
    if (symbol) {
      return mockOpenOrders.filter(o => o.pair === symbol);
    }
    return mockOpenOrders;
  },

  async createOrder(params: {
    pair: string;
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
  }): Promise<Order> {
    await delay(200);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      ...params,
      filled: 0,
      status: 'open',
      createdAt: new Date(),
    };
    mockOpenOrders.push(newOrder);
    return newOrder;
  },

  async cancelOrder(orderId: string): Promise<boolean> {
    await delay(100);
    const orderIndex = mockOpenOrders.findIndex(o => o.id === orderId);
    if (orderIndex >= 0) {
      mockOpenOrders[orderIndex].status = 'cancelled';
      return true;
    }
    return false;
  },
};

// WebSocket simulation for real-time updates
export class MockWebSocket {
  private callbacks: Map<string, ((data: unknown) => void)[]> = new Map();
  private intervals: NodeJS.Timeout[] = [];
  private currentPair: TradingPair;

  constructor(symbol: string) {
    const pair = tradingPairs.find(p => p.symbol === symbol);
    this.currentPair = pair || tradingPairs[0];
    this.startSimulation();
  }

  private startSimulation() {
    // Simulate price updates
    const priceInterval = setInterval(() => {
      const change = (Math.random() - 0.5) * this.currentPair.lastPrice * 0.001;
      this.currentPair.lastPrice += change;
      this.currentPair.change24h += (Math.random() - 0.5) * 0.1;
      this.emit('ticker', { ...this.currentPair });
    }, 2000);

    // Simulate order book updates
    const orderBookInterval = setInterval(() => {
      const orderBook = generateOrderBook(this.currentPair.lastPrice);
      this.emit('orderbook', orderBook);
    }, 1000);

    // Simulate trades
    const tradesInterval = setInterval(() => {
      const trade: Trade = {
        id: `trade-${Date.now()}`,
        price: this.currentPair.lastPrice + (Math.random() - 0.5) * this.currentPair.lastPrice * 0.001,
        amount: Math.random() * 0.05,
        timestamp: new Date(),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
      };
      this.emit('trade', trade);
    }, 3000);

    this.intervals.push(priceInterval, orderBookInterval, tradesInterval);
  }

  on(event: string, callback: (data: unknown) => void) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  private emit(event: string, data: unknown) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  close() {
    this.intervals.forEach(clearInterval);
    this.callbacks.clear();
  }
}
