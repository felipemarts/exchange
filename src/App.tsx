import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { Trading, Wallet, Statement, Orders } from './pages';
import { api } from './services/api';
import { mockWalletAssets, mockTransactions, mockOpenOrders } from './services/mockData';
import { User, Order } from './types';
import './App.scss';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOpenOrders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const userData = await api.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

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

  if (loading) {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Trading user={user} />} />
          <Route path="wallet" element={<Wallet assets={mockWalletAssets} />} />
          <Route path="orders" element={<Orders orders={orders} onCancelOrder={handleCancelOrder} />} />
          <Route path="statement" element={<Statement transactions={mockTransactions} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
