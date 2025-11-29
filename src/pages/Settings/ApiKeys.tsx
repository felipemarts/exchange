import { useState } from 'react';
import './Settings.scss';

interface ApiKey {
  id: string;
  name: string;
  apiKey: string;
  permissions: string[];
  ipRestriction: string | null;
  createdAt: string;
  lastUsed: string | null;
}

export function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Bot de Trading',
      apiKey: 'ak_live_xxxxxxxxxxxxxxxxxxxx',
      permissions: ['read', 'trade'],
      ipRestriction: '192.168.1.100',
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20 14:32',
    },
    {
      id: '2',
      name: 'Integração Portfolio',
      apiKey: 'ak_live_yyyyyyyyyyyyyyyyyyyy',
      permissions: ['read'],
      ipRestriction: null,
      createdAt: '2024-01-10',
      lastUsed: '2024-01-19 09:15',
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);
  const [newKeyIp, setNewKeyIp] = useState('');
  const [createdKey, setCreatedKey] = useState<{ apiKey: string; secret: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateKey = async () => {
    if (!newKeyName) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        apiKey: `ak_live_${Math.random().toString(36).substring(2, 22)}`,
        permissions: newKeyPermissions,
        ipRestriction: newKeyIp || null,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: null,
      };

      setKeys([...keys, newKey]);
      setCreatedKey({
        apiKey: newKey.apiKey,
        secret: `sk_live_${Math.random().toString(36).substring(2, 32)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta chave API? Esta ação não pode ser desfeita.')) {
      return;
    }

    setKeys(keys.filter((key) => key.id !== id));
  };

  const handleTogglePermission = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter((p) => p !== permission));
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission]);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewKeyName('');
    setNewKeyPermissions(['read']);
    setNewKeyIp('');
    setCreatedKey(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Chaves API</h1>
        <p>Gerencie suas chaves de acesso à API</p>
      </div>

      <div className="info-box warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <strong>Importante:</strong> Nunca compartilhe suas chaves API. Elas fornecem acesso à sua conta. Sempre use restrição de IP quando possível.
        </div>
      </div>

      <div className="api-keys-header">
        <h3>Suas chaves API</h3>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Criar nova chave
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          <h3>Nenhuma chave API</h3>
          <p>Você ainda não criou nenhuma chave API. Crie uma para integrar com bots de trading ou outras aplicações.</p>
        </div>
      ) : (
        <div className="api-keys-list">
          {keys.map((key) => (
            <div key={key.id} className="api-key-card">
              <div className="key-header">
                <div className="key-name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                  <span>{key.name}</span>
                </div>
                <button className="btn-danger-icon" onClick={() => handleDeleteKey(key.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              <div className="key-info">
                <div className="key-field">
                  <span className="field-label">API Key</span>
                  <div className="field-value">
                    <code>{key.apiKey.substring(0, 12)}...{key.apiKey.substring(key.apiKey.length - 4)}</code>
                    <button className="btn-icon" onClick={() => copyToClipboard(key.apiKey)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="key-field">
                  <span className="field-label">Permissões</span>
                  <div className="permissions-tags">
                    {key.permissions.includes('read') && (
                      <span className="permission-tag read">Leitura</span>
                    )}
                    {key.permissions.includes('trade') && (
                      <span className="permission-tag trade">Trading</span>
                    )}
                    {key.permissions.includes('withdraw') && (
                      <span className="permission-tag withdraw">Saque</span>
                    )}
                  </div>
                </div>

                <div className="key-field">
                  <span className="field-label">Restrição de IP</span>
                  <span className="field-value">{key.ipRestriction || 'Sem restrição'}</span>
                </div>

                <div className="key-meta">
                  <span>Criada em: {key.createdAt}</span>
                  <span>Último uso: {key.lastUsed || 'Nunca'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{createdKey ? 'Chave API criada' : 'Criar nova chave API'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              {createdKey ? (
                <div className="created-key-info">
                  <div className="success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                  </div>

                  <div className="warning-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p>Copie a Secret Key agora. Ela não será exibida novamente!</p>
                  </div>

                  <div className="key-display">
                    <div className="key-row">
                      <span className="key-label">API Key</span>
                      <div className="key-value">
                        <code>{createdKey.apiKey}</code>
                        <button className="btn-icon" onClick={() => copyToClipboard(createdKey.apiKey)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="key-row">
                      <span className="key-label">Secret Key</span>
                      <div className="key-value">
                        <code>{createdKey.secret}</code>
                        <button className="btn-icon" onClick={() => copyToClipboard(createdKey.secret)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleCloseModal}>
                    Entendi, fechar
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="keyName">Nome da chave</label>
                    <input
                      type="text"
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Ex: Bot de Trading, Integração Portfolio"
                    />
                  </div>

                  <div className="form-group">
                    <label>Permissões</label>
                    <div className="permissions-checkboxes">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes('read')}
                          onChange={() => handleTogglePermission('read')}
                        />
                        <span className="checkbox-label">
                          <strong>Leitura</strong>
                          <small>Consultar saldos, ordens e histórico</small>
                        </span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes('trade')}
                          onChange={() => handleTogglePermission('trade')}
                        />
                        <span className="checkbox-label">
                          <strong>Trading</strong>
                          <small>Criar e cancelar ordens</small>
                        </span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes('withdraw')}
                          onChange={() => handleTogglePermission('withdraw')}
                        />
                        <span className="checkbox-label">
                          <strong>Saque</strong>
                          <small>Realizar saques (requer 2FA)</small>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ipRestriction">Restrição de IP (opcional)</label>
                    <input
                      type="text"
                      id="ipRestriction"
                      value={newKeyIp}
                      onChange={(e) => setNewKeyIp(e.target.value)}
                      placeholder="Ex: 192.168.1.100"
                    />
                    <span className="input-hint">Deixe em branco para permitir qualquer IP (menos seguro)</span>
                  </div>

                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={handleCloseModal}>
                      Cancelar
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleCreateKey}
                      disabled={loading || !newKeyName || newKeyPermissions.length === 0}
                    >
                      {loading ? <span className="loading-spinner"></span> : 'Criar chave'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
