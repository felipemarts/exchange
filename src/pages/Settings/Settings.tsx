import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './Settings.scss';

export function Settings() {
  const location = useLocation();

  const menuItems = [
    {
      group: 'Cadastro',
      items: [
        { path: '/app/settings/profile', label: 'Atualização Cadastral', icon: 'user' },
        { path: '/app/settings/kyc', label: 'Validar CPF/CNPJ (KYC)', icon: 'shield' },
      ],
    },
    {
      group: 'Segurança',
      items: [
        { path: '/app/settings/2fa', label: 'Verificação em Duas Etapas', icon: 'lock' },
        { path: '/app/settings/devices', label: 'Dispositivos Confiáveis', icon: 'smartphone' },
        { path: '/app/settings/safe-word', label: 'Palavra Segura', icon: 'key' },
      ],
    },
    {
      group: 'Preferências',
      items: [
        { path: '/app/settings/notifications', label: 'Notificações', icon: 'bell' },
        { path: '/app/settings/theme', label: 'Tema', icon: 'sun' },
        { path: '/app/settings/api-keys', label: 'Chaves APIs', icon: 'code' },
      ],
    },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'shield':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        );
      case 'lock':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case 'smartphone':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        );
      case 'key':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        );
      case 'bell':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case 'sun':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        );
      case 'code':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16,18 22,12 16,6" />
            <polyline points="8,6 2,12 8,18" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-sidebar">
        <h2>Configurações</h2>
        <nav className="settings-nav">
          {menuItems.map((group) => (
            <div key={group.group} className="nav-group">
              <span className="group-label">{group.group}</span>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  {renderIcon(item.icon)}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
}
