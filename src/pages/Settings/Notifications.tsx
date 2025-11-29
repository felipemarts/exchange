import { useState } from 'react';
import './Settings.scss';

interface NotificationSettings {
  email: {
    login: boolean;
    deposit: boolean;
    withdrawal: boolean;
    trade: boolean;
    priceAlert: boolean;
    newsletter: boolean;
  };
  push: {
    login: boolean;
    deposit: boolean;
    withdrawal: boolean;
    trade: boolean;
    priceAlert: boolean;
  };
  sms: {
    login: boolean;
    withdrawal: boolean;
  };
}

export function Notifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      login: true,
      deposit: true,
      withdrawal: true,
      trade: false,
      priceAlert: true,
      newsletter: false,
    },
    push: {
      login: true,
      deposit: true,
      withdrawal: true,
      trade: true,
      priceAlert: true,
    },
    sms: {
      login: true,
      withdrawal: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggle = (
    category: keyof NotificationSettings,
    setting: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]],
      },
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Notificações</h1>
        <p>Gerencie como você recebe alertas e comunicações</p>
      </div>

      {success && (
        <div className="success-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          Preferências de notificação salvas com sucesso!
        </div>
      )}

      <div className="notification-section">
        <div className="notification-header">
          <div className="notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <h3>Notificações por E-mail</h3>
            <p>Receba atualizações importantes no seu e-mail</p>
          </div>
        </div>

        <div className="notification-options">
          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Login em novo dispositivo</span>
              <span className="item-desc">Alertas quando sua conta for acessada de um novo dispositivo</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.email.login}
                onChange={() => handleToggle('email', 'login')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Depósitos</span>
              <span className="item-desc">Confirmações de depósitos recebidos</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.email.deposit}
                onChange={() => handleToggle('email', 'deposit')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Saques</span>
              <span className="item-desc">Confirmações de saques processados</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.email.withdrawal}
                onChange={() => handleToggle('email', 'withdrawal')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Ordens executadas</span>
              <span className="item-desc">Alertas quando suas ordens forem executadas</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.email.trade}
                onChange={() => handleToggle('email', 'trade')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Alertas de preço</span>
              <span className="item-desc">Notificações quando o preço atingir seu alvo</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.email.priceAlert}
                onChange={() => handleToggle('email', 'priceAlert')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Newsletter</span>
              <span className="item-desc">Novidades, promoções e atualizações do AmazonEx</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.email.newsletter}
                onChange={() => handleToggle('email', 'newsletter')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="notification-section">
        <div className="notification-header">
          <div className="notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <h3>Notificações Push</h3>
            <p>Receba alertas em tempo real no navegador</p>
          </div>
        </div>

        <div className="notification-options">
          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Login em novo dispositivo</span>
              <span className="item-desc">Alertas de segurança instantâneos</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.push.login}
                onChange={() => handleToggle('push', 'login')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Depósitos</span>
              <span className="item-desc">Alertas de depósitos recebidos</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.push.deposit}
                onChange={() => handleToggle('push', 'deposit')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Saques</span>
              <span className="item-desc">Alertas de saques processados</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.push.withdrawal}
                onChange={() => handleToggle('push', 'withdrawal')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Ordens executadas</span>
              <span className="item-desc">Alertas em tempo real de trades</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.push.trade}
                onChange={() => handleToggle('push', 'trade')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Alertas de preço</span>
              <span className="item-desc">Notificações instantâneas de preço</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.push.priceAlert}
                onChange={() => handleToggle('push', 'priceAlert')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="notification-section">
        <div className="notification-header">
          <div className="notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <h3>Notificações por SMS</h3>
            <p>Alertas críticos de segurança via mensagem de texto</p>
          </div>
        </div>

        <div className="notification-options">
          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Login em novo dispositivo</span>
              <span className="item-desc">SMS de alerta para acessos suspeitos</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.sms.login}
                onChange={() => handleToggle('sms', 'login')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="item-info">
              <span className="item-title">Saques</span>
              <span className="item-desc">Confirmação de saques via SMS</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.sms.withdrawal}
                onChange={() => handleToggle('sms', 'withdrawal')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? <span className="loading-spinner"></span> : 'Salvar preferências'}
        </button>
      </div>
    </div>
  );
}
