import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { Trading, Wallet, Statement, Orders, Deposit, Withdraw, QuickTrade, Dashboard, Markets } from './pages';
import { Login, SignUp, Recover } from './pages/Auth';
import {
  Settings,
  Profile,
  KYC,
  TwoFactor,
  Devices,
  SafeWord,
  Notifications,
  Theme,
  ApiKeys,
} from './pages/Settings';
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
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recover" element={<Recover />} />

        {/* Main App Routes */}
        <Route path="/app" element={<Layout user={user} />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="broker" element={<Trading user={user} />} />
          <Route path="trade" element={<QuickTrade />} />
          <Route path="markets" element={<Markets />} />
          <Route path="wallet" element={<Wallet assets={mockWalletAssets} />} />
          <Route path="orders" element={<Orders orders={orders} onCancelOrder={handleCancelOrder} />} />
          <Route path="statement" element={<Statement transactions={mockTransactions} />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />

          {/* Settings Routes */}
          <Route path="settings" element={<Settings />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="2fa" element={<TwoFactor />} />
            <Route path="devices" element={<Devices />} />
            <Route path="safe-word" element={<SafeWord />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="theme" element={<Theme />} />
            <Route path="api-keys" element={<ApiKeys />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
