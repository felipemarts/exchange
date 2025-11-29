import { useState } from 'react';
import './Settings.scss';

export function TwoFactor() {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AmazonEx:felipe@email.com?secret=${secretKey}&issuer=AmazonEx`;

  const handleEnable = async () => {
    if (code.length !== 6) {
      setError('Digite o código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEnabled(true);
      setStep(1);
    } catch (err) {
      setError('Código inválido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (code.length !== 6) {
      setError('Digite o código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEnabled(false);
      setCode('');
    } catch (err) {
      setError('Código inválido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (enabled && step === 1) {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h1>Verificação em Duas Etapas</h1>
          <p>Adicione uma camada extra de segurança à sua conta</p>
        </div>

        <div className="two-factor-status enabled">
          <div className="status-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h2>2FA Ativado</h2>
          <p>Sua conta está protegida com autenticação em duas etapas.</p>

          <div className="two-factor-options">
            <button className="btn-danger" onClick={() => setStep(3)}>
              Desativar 2FA
            </button>
          </div>
        </div>

        <div className="info-box warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>Importante:</strong> Se você perder acesso ao seu aplicativo autenticador,
            entre em contato com nosso suporte para recuperar o acesso à sua conta.
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h1>Desativar 2FA</h1>
          <p>Digite o código do seu aplicativo autenticador para desativar</p>
        </div>

        <div className="two-factor-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Código de verificação</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="verification-input"
            />
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => { setStep(1); setCode(''); setError(''); }}>
              Cancelar
            </button>
            <button className="btn-danger" onClick={handleDisable} disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Desativar 2FA'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Verificação em Duas Etapas</h1>
        <p>Adicione uma camada extra de segurança à sua conta</p>
      </div>

      {step === 1 && (
        <>
          <div className="two-factor-status disabled">
            <div className="status-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2>2FA Desativado</h2>
            <p>Ative a verificação em duas etapas para maior segurança.</p>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Ativar 2FA
            </button>
          </div>

          <div className="info-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong>O que é 2FA?</strong>
              <p>A autenticação em duas etapas adiciona uma camada extra de segurança, exigindo um código
              temporário além da sua senha para fazer login.</p>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="two-factor-setup">
          <div className="setup-steps">
            <div className="setup-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Baixe um aplicativo autenticador</h4>
                <p>Recomendamos Google Authenticator ou Authy</p>
                <div className="app-buttons">
                  <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer">
                    Google Play
                  </a>
                  <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" rel="noopener noreferrer">
                    App Store
                  </a>
                </div>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Escaneie o código QR</h4>
                <p>Abra o aplicativo e escaneie o código abaixo</p>
                <div className="qr-code">
                  <img src={qrCodeUrl} alt="QR Code" />
                </div>
                <div className="manual-key">
                  <span>Ou digite manualmente:</span>
                  <code>{secretKey}</code>
                  <button onClick={() => navigator.clipboard.writeText(secretKey)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Digite o código</h4>
                <p>Insira o código de 6 dígitos do aplicativo</p>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="verification-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => { setStep(1); setCode(''); setError(''); }}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleEnable} disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Ativar 2FA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
