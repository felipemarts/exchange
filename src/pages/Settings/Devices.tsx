import { useState } from 'react';
import './Settings.scss';

interface Device {
  id: string;
  name: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: Date;
  current: boolean;
  trusted: boolean;
}

export function Devices() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      browser: 'Chrome 119',
      os: 'macOS Sonoma',
      ip: '192.168.1.***',
      location: 'São Paulo, BR',
      lastActive: new Date(),
      current: true,
      trusted: true,
    },
    {
      id: '2',
      name: 'iPhone 15',
      browser: 'Safari',
      os: 'iOS 17',
      ip: '189.45.***',
      location: 'São Paulo, BR',
      lastActive: new Date(Date.now() - 3600000),
      trusted: true,
      current: false,
    },
    {
      id: '3',
      name: 'Windows PC',
      browser: 'Firefox 120',
      os: 'Windows 11',
      ip: '200.158.***',
      location: 'Rio de Janeiro, BR',
      lastActive: new Date(Date.now() - 86400000 * 3),
      trusted: false,
      current: false,
    },
  ]);
  const [loading, setLoading] = useState<string | null>(null);

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} minutos atrás`;
    if (hours < 24) return `${hours} horas atrás`;
    return `${days} dias atrás`;
  };

  const getDeviceIcon = (os: string) => {
    if (os.toLowerCase().includes('ios') || os.toLowerCase().includes('iphone')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    }
    if (os.toLowerCase().includes('android')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    }
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  };

  const handleRemoveDevice = async (deviceId: string) => {
    setLoading(deviceId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDevices(devices.filter((d) => d.id !== deviceId));
    } finally {
      setLoading(null);
    }
  };

  const handleToggleTrust = async (deviceId: string) => {
    setLoading(deviceId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDevices(
        devices.map((d) =>
          d.id === deviceId ? { ...d, trusted: !d.trusted } : d
        )
      );
    } finally {
      setLoading(null);
    }
  };

  const handleRevokeAll = async () => {
    setLoading('all');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDevices(devices.filter((d) => d.current));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Dispositivos Confiáveis</h1>
        <p>Gerencie os dispositivos que têm acesso à sua conta</p>
      </div>

      <div className="devices-header">
        <div className="devices-count">
          <span className="count">{devices.length}</span>
          <span className="label">dispositivos conectados</span>
        </div>
        {devices.length > 1 && (
          <button
            className="btn-danger-outline"
            onClick={handleRevokeAll}
            disabled={loading === 'all'}
          >
            {loading === 'all' ? (
              <span className="loading-spinner"></span>
            ) : (
              'Revogar todos'
            )}
          </button>
        )}
      </div>

      <div className="devices-list">
        {devices.map((device) => (
          <div key={device.id} className={`device-card ${device.current ? 'current' : ''}`}>
            <div className="device-icon">{getDeviceIcon(device.os)}</div>
            <div className="device-info">
              <div className="device-name">
                {device.name}
                {device.current && <span className="current-badge">Este dispositivo</span>}
                {device.trusted && !device.current && (
                  <span className="trusted-badge">Confiável</span>
                )}
              </div>
              <div className="device-details">
                <span>{device.browser}</span>
                <span className="separator">•</span>
                <span>{device.os}</span>
              </div>
              <div className="device-meta">
                <span className="location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {device.location}
                </span>
                <span className="separator">•</span>
                <span className="ip">IP: {device.ip}</span>
                <span className="separator">•</span>
                <span className="last-active">{formatLastActive(device.lastActive)}</span>
              </div>
            </div>
            <div className="device-actions">
              {!device.current && (
                <>
                  <button
                    className={`btn-icon ${device.trusted ? 'trusted' : ''}`}
                    onClick={() => handleToggleTrust(device.id)}
                    disabled={loading === device.id}
                    title={device.trusted ? 'Remover confiança' : 'Marcar como confiável'}
                  >
                    {loading === device.id ? (
                      <span className="loading-spinner small"></span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        {device.trusted && <path d="M9 12l2 2 4-4" />}
                      </svg>
                    )}
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleRemoveDevice(device.id)}
                    disabled={loading === device.id}
                    title="Remover dispositivo"
                  >
                    {loading === device.id ? (
                      <span className="loading-spinner small"></span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="info-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <strong>Sobre dispositivos confiáveis</strong>
          <p>
            Dispositivos marcados como confiáveis não precisarão de verificação adicional ao fazer login.
            Recomendamos marcar apenas dispositivos pessoais que você usa regularmente.
          </p>
        </div>
      </div>
    </div>
  );
}
